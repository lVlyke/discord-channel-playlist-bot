import * as Discord from "discord.js";
import * as _ from "lodash";
import { Command } from "../command";
import { store } from "../data-store";
import { Subscription } from "../models/subscription";
import { SpotifyUser } from "../models/spotify-user";
import { DataStore, Constants } from "../constants";

export const Strings = Constants.Strings.Commands.Subscribe;

export const SubscribeCommand: Command = (message: Discord.Message, ..._args: string[]) => {
    const spotifyUserId = (store.get<SpotifyUser.LookupMap>(DataStore.Keys.spotifyUserLookupMap) || {})[message.author.id];

    if (!spotifyUserId) {
        message.channel.send(Strings.unregisteredUserId[1]);
        message.channel.send(Strings.unregisteredUserId[2]);
        return;
    }

    let didSubscribe = true;

    store.mutate<Subscription.Collection>(DataStore.Keys.subscriptions, (collection) => {
        collection = collection || {};

        const channelId = message.channel.id;
        const idList: SpotifyUser.Id[] = collection[channelId] || [];

        if (_.includes(idList, spotifyUserId)) {
            message.channel.send(Strings.alreadySubscribed);

            didSubscribe = false;
            return collection;
        }

        // Add the user's Spotify ID to the subscription list
        idList.push(spotifyUserId);

        collection[channelId] = idList;
        return collection;
    });

    if (didSubscribe) {
        message.channel.send(Strings.successResponse);
    }
};