import * as Discord from "discord.js";
import * as _ from "lodash";
import { store } from "./data-store";
import { Playlist } from "./models/playlist";
import { ChannelPlaylistCollection } from "./models/channel-playlist-collection";
import { SpotifyHelpers } from "./spotify";
import { Config } from "./models/config";
import { DataStore, Strings } from "./constants";

const config: Config = require("../config.json");

export const SPOTIFY_URL_REGEX = /^(?:https?:\/\/)?open\.spotify\.com\/track\/([^\?\s]+)(\?[^\s]+)?$/i;

export const discordClient: Discord.Client = new Discord.Client();

export namespace DiscordHelpers {

    export function extractTracks(message: Discord.Message): string[] {
        // Extract are any Spotify songs in this message
        return message.content
            .split(/\s+/)
            .reduce<string[]>((uriList: string[], token: string) => {
                const regexMatch = SPOTIFY_URL_REGEX.exec(token);
        
                if (regexMatch && regexMatch.length > 1) {
                    uriList.push(regexMatch[1]);
                }
        
                return uriList;
            }, []);
    }

    export function extractAndProcessTracks(message: Discord.Message): string[] {
        return processTracks(message.channel as Discord.TextChannel, extractTracks(message));
    }

    export function processTracks(channel: Discord.TextChannel, trackUris: string[]): string[] {
        if (!_.isEmpty(trackUris)) {
            let channelPlaylistCollection = store.get<ChannelPlaylistCollection>(DataStore.Keys.channelPlaylistCollection) || {};
            let channelPlaylist: Playlist = channelPlaylistCollection[channel.id] || Playlist.create(channel);
    
            // Add all Spotify URIs from the message to the playlist
            channelPlaylist.songUris.push(...trackUris.map(uri => SpotifyHelpers.encodeUri(uri)));
            channelPlaylist.lastUpdateDate = new Date().toISOString();
    
            // Update the collection
            channelPlaylistCollection[channel.id] = channelPlaylist;
            store.set<ChannelPlaylistCollection>(DataStore.Keys.channelPlaylistCollection, channelPlaylistCollection);
    
            if (config.messageOnPlaylistChange) {
                channel.send(Strings.Notifications.messageOnPlaylistChange);
            }
        }

        return trackUris;
    }
}