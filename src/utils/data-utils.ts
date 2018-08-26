import * as _ from "lodash";
import { Subscription } from "../models/subscription";
import { DataStore } from "../constants";
import { store } from "../data-store";

export namespace DataUtils {

    export function isChannelSubscribedTo(channelId: string): boolean {
        const subscriptions = store.get<Subscription.Collection>(DataStore.Keys.subscriptions);

        return _.includes(_.keys(subscriptions), channelId);
    }
}