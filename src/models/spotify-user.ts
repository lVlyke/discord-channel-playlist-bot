export namespace SpotifyUser {

    export type Id = string;
    
    export interface LookupMap {
        [discordId: string]: SpotifyUser.Id
    }
}