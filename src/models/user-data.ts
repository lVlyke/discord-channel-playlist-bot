export interface UserData {
    playlists?: UserData.PlaylistCollection;
}

export namespace UserData {

    export type PlaylistId = string;

    export interface PlaylistCollection {
        [channelId: string]: PlaylistId
    }

    export interface Collection {
        [userId: string]: UserData
    }
}