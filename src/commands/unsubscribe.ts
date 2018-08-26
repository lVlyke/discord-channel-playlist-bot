import * as Discord from "discord.js";
import * as _ from "lodash";
import { Command } from "../command";
import { store } from "../data-store";
import { Subscription } from "../models/subscription";
import { SpotifyUser } from "../models/spotify-user";
import { DataStore, Constants } from "../constants";

export const Strings = Constants.Strings.Commands.Unsubscribe;

export const UnsubscribeCommand: Command = (message: Discord.Message, ..._args: string[]) => {
    const spotifyUserId = (store.get<SpotifyUser.LookupMap>(DataStore.Keys.spotifyUserLookupMap) || {})[message.author.id];

    if (!spotifyUserId) {
        message.channel.send(Strings.notSubscribed);
        return;
    }

    let didUnsubscribe = true;

    store.mutate<Subscription.Collection>(DataStore.Keys.subscriptions, (collection) => {
        collection = collection || {};

        const channelId = message.channel.id;
        let idList: SpotifyUser.Id[] = collection[channelId] || [];

        if (!_.includes(idList, spotifyUserId)) {
            message.channel.send(Strings.notSubscribed);

            didUnsubscribe = false;
            return collection;
        }

        // Remove the user's Spotify ID from the subscription list
        idList = _.remove(idList, spotifyUserId);

        collection[channelId] = idList;
        return collection;
    });

    if (didUnsubscribe) {
        message.channel.send(Strings.successResponse);
    }
};