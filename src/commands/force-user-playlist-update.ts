import * as Discord from "discord.js";
import { Command } from "../command";
import { Playlist } from "../models/playlist";
import { ChannelPlaylistCollection } from "../models/channel-playlist-collection";
import { store } from "../data-store";
import { SpotifyHelpers } from "../spotify";
import { Subscription } from "../models/subscription";

export const ForceUserPlaylistUpdateCommand: Command = async (message: Discord.Message, ..._args: string[]) => {
    const channelPlaylistCollection = store.get<ChannelPlaylistCollection>("channelPlaylistCollection");
    const channelPlaylist: Playlist = channelPlaylistCollection[message.channel.id] || Playlist.create(<Discord.TextChannel>message.channel);
    const subscriptions = store.get<Subscription.Collection>("subscriptions");
    const channelSubs = subscriptions[message.channel.id];

    for (const userId of channelSubs) {
        await SpotifyHelpers.updateChannelPlaylist(userId, channelPlaylist);
    }

    message.channel.send("The latest weekly channel playlist has been published on Spotify!");
};