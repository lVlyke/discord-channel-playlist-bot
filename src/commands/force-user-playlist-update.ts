import * as Discord from "discord.js";
import { Command } from "../command";
import { Playlist } from "../models/playlist";
import { ChannelPlaylistCollection } from "../models/channel-playlist-collection";
import { store } from "../data-store";
import { SpotifyHelpers } from "../spotify";

export const ForceUserPlaylistUpdateCommand: Command = async (message: Discord.Message, ..._args: string[]) => {
    const channelPlaylistCollection = store.get<ChannelPlaylistCollection>("channelPlaylistCollection") || {};
    const channelPlaylist: Playlist = channelPlaylistCollection[message.channel.id];

    if (channelPlaylist) {
        await SpotifyHelpers.updateChannelPlaylist(channelPlaylist);

        message.channel.send("The latest weekly channel playlist has been published on Spotify!");
    }
    return Promise.resolve();
};