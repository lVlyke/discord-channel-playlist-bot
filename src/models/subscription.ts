import { SpotifyUser } from "./spotify-user";

export namespace Subscription {
    export interface Collection {
        [channelId: string]: SpotifyUser.Id[];
    }
}