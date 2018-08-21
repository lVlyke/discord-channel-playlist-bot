import { Playlist } from "./playlist";

export interface ChannelPlaylistCollection {
    [channelId: string]: Playlist;
}