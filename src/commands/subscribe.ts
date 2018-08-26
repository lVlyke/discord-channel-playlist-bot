import * as Discord from "discord.js";
import * as _ from "lodash";
import { Command } from "../command";
import { store } from "../data-store";
import { Subscription } from "../models/subscription";
import { SpotifyUser } from "../models/spotify-user";
import { DataStore } from "../constants";

export const SubscribeCommand: Command = (message: Discord.Message, ..._args: string[]) => {
    const spotifyUserId = (store.get<SpotifyUser.LookupMap>(DataStore.Keys.spotifyUserLookupMap) || {})[message.author.id];

    if (!spotifyUserId) {
        message.channel.send("You need to authorize me to manage your channel playlists before you can subscribe.");
        message.channel.send("To authorize, please @Mention me and say 'authorize <Spotify User ID>' with your Spotify ID.");
        return;
    }

    let didSubscribe = true;

    store.mutate<Subscription.Collection>(DataStore.Keys.subscriptions, (collection) => {
        collection = collection || {};

        const channelId = message.channel.id;
        const idList: SpotifyUser.Id[] = collection[channelId] || [];

        if (_.includes(idList, spotifyUserId)) {
            message.channel.send("You are already subscribed to this channel's playlist.");

            didSubscribe = false;
            return collection;
        }

        // Add the user's Spotify ID to the subscription list
        idList.push(spotifyUserId);

        collection[channelId] = idList;
        return collection;
    });

    if (didSubscribe) {
        message.channel.send("You have subscribed to this channel's Spotify playlist. You will receive a new playlist each week with music submitted to this channel.");
    }
};