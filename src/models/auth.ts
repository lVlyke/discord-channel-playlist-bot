export interface Auth {
    discord: {
        token: string;
    };

    spotify: {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
    };
}