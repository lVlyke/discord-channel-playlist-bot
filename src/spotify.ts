import * as SpotifyWebApi from "spotify-web-api-node";
import * as moment from "moment";
import * as _ from "lodash";
import { UserData } from "./models/user-data";
import { store } from "./data-store";
import { SpotifyUser } from "./models/spotify-user";
import { Playlist } from "./models/playlist";
import { UserAuth } from "./models/user-auth";
import { Auth } from "./models/auth";
import { Subscription } from "./models/subscription";
import { Config } from "./models/config";
import { DataStore } from "./constants";

const auth: Auth = require("../auth.json");
const config: Config = require("../config.json");

export const spotifyClient = new SpotifyWebApi({
    clientId: auth.spotify.clientId,
    clientSecret: auth.spotify.clientSecret,
    redirectUri: auth.spotify.redirectUri
});

export namespace SpotifyHelpers {

    export enum AuthenticationError {
        UNKNOWN,
        NOT_AUTHORIZED,
        INVALID_TOKEN
    }

    export function createAuthorizationUrl(): string {
        return spotifyClient.createAuthorizeURL(["playlist-modify-public"]);
    }

    export async function refreshAccessToken(auth: UserAuth): Promise<void> {
        spotifyClient.setAccessToken(auth.accessToken);
        spotifyClient.setRefreshToken(auth.refreshToken);

        let data;
        try {
            data = await spotifyClient.refreshAccessToken();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
        
        auth.accessToken = data.body.access_token;
        auth.expirationDate = moment().add(data.body.expires_in, "seconds").toISOString();
        return Promise.resolve();
    }

    export async function authenticateAsUser(userId: SpotifyUser.Id): Promise<void> {
        const authCollection = store.get<UserAuth.Collection>(DataStore.Keys.userAuthCollection);
        const record: UserAuth = authCollection[userId];

        if (!record) {
            return Promise.reject(AuthenticationError.NOT_AUTHORIZED);
        }

        if (moment().isAfter(record.expirationDate)) {
            try {
                // Refresh the user's access token
                await refreshAccessToken(record);

                // Update the store
                store.set<UserAuth.Collection>(DataStore.Keys.userAuthCollection, authCollection);
            } catch (_e) {
                return Promise.reject(AuthenticationError.INVALID_TOKEN);
            }
        }

        spotifyClient.setAccessToken(record.accessToken);
        spotifyClient.setRefreshToken(record.refreshToken);
        return Promise.resolve();
    }

    export async function createUserPlaylist(userId: SpotifyUser.Id, name: string): Promise<string> {
        let response;
        try {
            response = await spotifyClient.createPlaylist(userId, name);
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }

        return Promise.resolve(response.body.id);
    }

    export async function updateChannelPlaylist(playlist: Playlist): Promise<void> {
        const subscriptions = store.get<Subscription.Collection>(DataStore.Keys.subscriptions);
        const channelSubs = subscriptions[playlist.channelId];

        for (const userId of channelSubs) {
            try {
                await SpotifyHelpers.updateChannelPlaylistForUser(userId, playlist);
            } catch (e) {
                console.warn(e);
                console.warn("Failed to update one or more user playlists.");
            }
        }

        return Promise.resolve();
    }

    export async function updateChannelPlaylistForUser(userId: SpotifyUser.Id, playlist: Playlist): Promise<void> {
        const userDataStore = store.get<UserData.Collection>(DataStore.Keys.userData) || {};
        
        function userPlaylists(): UserData.PlaylistCollection {
            let userData = userDataStore[userId];

            if (!userData) {
                userData = userDataStore[userId] = {};
            }

            if (!userData.playlists) {
                userData.playlists = {};
            }

            return userData.playlists;
        }

        function userPlaylistId(): string {
            return userPlaylists()[playlist.channelId];
        }

        async function makeList(): Promise<void> {
            userPlaylists()[playlist.channelId] = await createUserPlaylist(userId, `${playlist.channelName} - ${config.playlistName}`);
            store.set<UserData.Collection>(DataStore.Keys.userData, userDataStore);
            return Promise.resolve();
        }

        // Authenticate as the user
        try {
            await authenticateAsUser(userId);
        } catch (e) {
            console.error(e);
            return Promise.reject("updateChannelPlaylist - Failed to authenticate user.");
        }

        // Check if the last used playlist exists
        try {
            await spotifyClient.getPlaylist(userPlaylistId());
        } catch (e) {
            console.warn(e);

            // Playlist doesn't exist, so make a new one
            await makeList();
        }

        // Get the tracks currently on the user's playlist
        let playlistTracksResponse;
        try {
            playlistTracksResponse = await spotifyClient.getPlaylistTracks(userPlaylistId());
        } catch (e) {
            console.warn(e);

            // Playlist messed up, so make a new one
            await makeList();
        }

        // Remove all tracks from the user's playlist
        const tracksToRemove = playlistTracksResponse.body.items.map(item => ({ uri: item.track.uri }));
        if (!_.isEmpty(tracksToRemove)) {
            try {
                await spotifyClient.removeTracksFromPlaylist(userPlaylistId(), tracksToRemove);
            } catch (e) {
                console.warn(e);
                
                // Playlist messed up, so make a new one
                await makeList();
            }
        }

        // Add the channel's playlist to the user's playlist
        try {
            await spotifyClient.addTracksToPlaylist(userPlaylistId(), playlist.songUris);
        } catch (e) {
            console.error(e);
            return Promise.reject("updateChannelPlaylist - Failed to add playlist tracks from channel.");
        }

        return Promise.resolve();
    }

    export function encodeUri(track: string): string {
        return `spotify:track:${track}`;
    }
}