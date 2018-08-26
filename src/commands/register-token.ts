import * as Discord from "discord.js";
import * as moment from "moment";
import { Command } from "../command";
import { spotifyClient } from "../spotify";
import { store } from "../data-store";
import { UserAuth } from "../models/user-auth";
import { SpotifyUser } from "../models/spotify-user";
import { DataStore, Constants } from "../constants";

export const Strings = Constants.Strings.Commands.RegisterToken;

export const RegisterTokenCommand: Command = async (message: Discord.Message, ...args: string[]) => {
    if (args.length < 1) {
        message.channel.send(Strings.missingToken[1]);
        message.channel.send(Strings.missingToken[2]);
        return Promise.reject();
    }

    const [authCode] = [...args];

    if (!authCode) {
        message.channel.send(Strings.invalidToken[1]);
        message.channel.send(Strings.invalidToken[2]);
        return Promise.reject();
    }

    // Retrieve an access token and a refresh token
    let data;
    try {
        data = await spotifyClient.authorizationCodeGrant(authCode);
    } catch (e) {
        message.channel.send(Strings.invalidToken[1]);
        message.channel.send(Strings.invalidToken[2]);

        console.error(e);
        return Promise.reject(e);
    }
    
    const accessToken: string = data.body.access_token;
    const refreshToken: string = data.body.refresh_token;
    const expirationDate: string = moment().add(data.body.expires_in, "seconds").toISOString();

    // Set the access token on the API object to use it in later calls
    spotifyClient.setAccessToken(accessToken);
    spotifyClient.setRefreshToken(refreshToken);

    let meResponse: any;
    try {
        meResponse = await spotifyClient.getMe();
    } catch (e) {
        message.channel.send(Strings.invalidToken[1]);
        message.channel.send(Strings.invalidToken[2]);

        console.error(e);
        return Promise.reject(e);
    }

    const spotifyUserId: SpotifyUser.Id = meResponse.body.id;

    // Store the token for the user
    store.mutate<UserAuth.Collection>(DataStore.Keys.userAuthCollection, collection => {
        collection = collection || {};
        collection[spotifyUserId] = {
            accessToken,
            refreshToken,
            expirationDate
        };

        return collection;
    });

    // Update the Spotify user lookup table
    store.mutate<SpotifyUser.LookupMap>(DataStore.Keys.spotifyUserLookupMap, map => {
        map = map || {};
        map[message.author.id] = spotifyUserId;
        return map;
    });

    message.channel.send(Strings.successResponse);
    return Promise.resolve();
};