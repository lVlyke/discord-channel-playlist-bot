import * as Spotify from "spotify-web-api-js";
//import * as XMLHttpRequest from "xhr2";
import { logger } from "./logger";
import { UserChannelPlaylist } from "./models/user-channel-playlist";
import { store } from "./data-store";
import { SpotifyUserId } from "./models/spotify-user";
import { Playlist } from "./models/playlist";

const auth: any = require("../auth.json");

export const spotifyClient = new Spotify();

export namespace SpotifyHelpers {

    export async function updateChannelPlaylist(userId: SpotifyUserId, playlist: Playlist): Promise<boolean> {
        const userChannelPlaylists = store.get<UserChannelPlaylist.List>("userChannelPlaylists") || {};

        if (!userChannelPlaylists[userId]) {
            let response;
            
            try {
                response = await spotifyClient.createPlaylist(userId, {
                    name: `${playlist.channelName} - Weekly Playlist`
                });
            } catch (e) {
                console.error(e);
                return Promise.resolve(false);
            }

            userChannelPlaylists[userId] = response.id;
        }

        const playlistId = userChannelPlaylists[userId];

        // Get the user's channel playlist tracks
        const playlistTracksResponse = await spotifyClient.getPlaylistTracks(userId, playlistId);

        // Remove all tracks from the user's playlist
        await spotifyClient.removeTracksFromPlaylist(userId, playlistId, playlistTracksResponse.items.map(item => item.track.id));

        // Add the current channel's playlist tracks to the user's playlist
        await spotifyClient.addTracksToPlaylist(userId, playlistId, playlist.songUris);

        return Promise.resolve(true);
    }
}


/*function getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open("POST", "https://accounts.spotify.com/api/token");

        req.setRequestHeader("Authorization", `Basic ${new Buffer(`${auth.spotify.clientId}:${auth.spotify.clientSecret}`).toString("base64")}`);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === 200) {
                    resolve(req.responseText);
                }
                else {
                    reject(req.response);
                }
            }
        };

        req.send(JSON.stringify({ grant_type: "client_credentials" }));
    });
}*/

// Setup the client
(async () => {
    const token = auth.spotify.token;//await getToken();

    spotifyClient.setPromiseImplementation(Promise);

    // set access token
    spotifyClient.setAccessToken(token);

    logger.info(`Got Spotify token: ${token}`);
})();