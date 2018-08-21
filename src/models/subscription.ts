import { SpotifyUserId } from "./spotify-user";

export namespace Subscription {
    export interface Collection {
        [channelId: string]: SpotifyUserId[];
    }
}