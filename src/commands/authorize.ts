import * as Discord from "discord.js";
import * as _ from "lodash";
import { Command } from "../command";
import { SpotifyHelpers } from "../spotify";
import { Constants } from "../constants";

export const Strings = Constants.Strings.Commands.Authorize;

export const AuthorizeCommand: Command = (message: Discord.Message, ...args: string[]) => {
    if (args.length < 1) {
        message.channel.send(Strings.missingAuth[1]);
        message.channel.send(Strings.missingAuth[2]);
        // TODO - Tell user how to get user ID
        return;
    }

    const [spotifyUserId] = [...args];

    if (!spotifyUserId) {
        message.channel.send(Strings.invalidAuth);
        return;
    }

    message.channel.send(_.template(Strings.successResponse)({ authorizationUrl: SpotifyHelpers.createAuthorizationUrl() }));
};