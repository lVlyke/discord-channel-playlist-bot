import * as Discord from "discord.js";
import * as _ from "lodash";
import { store } from "./data-store";
import { Playlist } from "./models/playlist";
import { ChannelPlaylistCollection } from "./models/channel-playlist-collection";
import { SpotifyHelpers } from "./spotify";
import { Config } from "./models/config";
import { DataStore } from "./constants";

const config: Config = require("../config.json");

export const SPOTIFY_URL_REGEX = /^(?:https?:\/\/)?open\.spotify\.com\/track\/([^\?\s]+)(\?[^\s]+)?$/i;

export const discordClient: Discord.Client = new Discord.Client();

export namespace DiscordHelpers {

    export function checkForTracks(message: Discord.Message) {
        const messageTokens = message.content.split(/\s+/);
    
        // Check if there are any Spotify songs in this message
        const spotifyUris = messageTokens.reduce<string[]>((uriList: string[], token: string) => {
            const regexMatch = SPOTIFY_URL_REGEX.exec(token);
    
            if (regexMatch && regexMatch.length > 1) {
                uriList.push(regexMatch[1]);
            }
    
            return uriList;
        }, []);
    
        if (!_.isEmpty(spotifyUris)) {
            let channelPlaylistCollection = store.get<ChannelPlaylistCollection>(DataStore.Keys.channelPlaylistCollection) || {};
            let channelPlaylist: Playlist = channelPlaylistCollection[message.channel.id] || Playlist.create(<Discord.TextChannel>message.channel);
    
            // Add all Spotify URIs from the message to the playlist
            channelPlaylist.songUris.push(...spotifyUris.map(uri => SpotifyHelpers.encodeUri(uri)));
    
            // Update the collection
            channelPlaylistCollection[message.channel.id] = channelPlaylist;
            store.set<ChannelPlaylistCollection>(DataStore.Keys.channelPlaylistCollection, channelPlaylistCollection);
    
            if (config.messageOnPlaylistChange) {
                message.channel.send("Your track(s) have been added to the playlist.");
            }
        }
    }
}