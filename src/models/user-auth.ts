export interface UserAuth {
    accessToken: string;
    refreshToken: string;
    expirationDate: string;
}

export namespace UserAuth {

    export interface Collection {
        [userId: string]: UserAuth
    }
}
