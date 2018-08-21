export namespace UserChannelPlaylist {

    export type Id = string;

    export interface List {
        [userId: string]: UserChannelPlaylist.Id
    }
}