import * as Discord from "discord.js";
import { Command } from "../command";
import { Playlist } from "../models/playlist";
import { ChannelPlaylistCollection } from "../models/channel-playlist-collection";
import { store } from "../data-store";
import { SpotifyHelpers } from "../spotify";
import { Subscription } from "../models/subscription";

export const ForceUserPlaylistUpdateCommand: Command = async (message: Discord.Message, ..._args: string[]) => {
    const channelPlaylistCollection = store.get<ChannelPlaylistCollection>("channelPlaylistCollection") || {};
    const channelPlaylist: Playlist = channelPlaylistCollection[message.channel.id];

    if (channelPlaylist) {
        const subscriptions = store.get<Subscription.Collection>("subscriptions");
        const channelSubs = subscriptions[message.channel.id];

        for (const userId of channelSubs) {
            try {
                await SpotifyHelpers.updateChannelPlaylist(userId, channelPlaylist);
            } catch (e) {
                console.error(e);
                console.error("Failed to update one or more user lists.");
            }
        }

        message.channel.send("The latest weekly channel playlist has been published on Spotify!");
    }
    return Promise.resolve();
};