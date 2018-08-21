import * as Discord from "discord.js";
import { Command } from "../command";
import { store } from "../data-store";
import { Subscription } from "../models/subscription";
import { SpotifyUserId } from "../models/spotify-user";

export const SubscribeCommand: Command = (message: Discord.Message, ...args: string[]) => {
    if (args.length < 1) {
        message.channel.send("In order to subscribe to a playlist for this channel, you need to provide your Spotify user ID.");
        return;
    }

    const [spotifyUserId] = [...args];

    if (!spotifyUserId) {
        message.channel.send("Invalid Spotify user ID.");
        return;
    }

    let didSubscribe = true;

    store.mutate<Subscription.Collection>("subscriptions", (collection) => {
        collection = collection || {};
        console.log(collection);
        const channelId = message.channel.id;
        const idList: SpotifyUserId[] = collection[channelId] || [];

        if (idList.some(id => id === spotifyUserId)) {
            message.channel.send("You are already subscribed to this channel's playlist.");

            didSubscribe = false;
            return collection;
        }

        // Add the user's Spotify ID to the subscription list
        idList.push(spotifyUserId);

        collection[channelId] = idList;
        console.log(collection);
        return collection;
    });

    if (didSubscribe) {
        message.channel.send("You have subscribed to this channel's Spotify playlist. You will receive a new playlist each week with music submitted to this channel.");
    }
};