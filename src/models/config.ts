export interface Config {
    messageOnPlaylistChange: boolean;
    messageOnPlaylistCommit: boolean;
    keepOldPlaylistSongs: boolean;
    playlistUpdateFrequency: number; //seconds
    playlistName: string;
    dataStoreLocation: string;
}