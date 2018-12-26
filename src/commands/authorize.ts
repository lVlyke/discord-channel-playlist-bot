import * as Discord from "discord.js";
import * as _ from "lodash";
import { Command } from "../command";
import { SpotifyHelpers } from "../spotify";
import { Constants } from "../constants";

export const Strings = Constants.Strings.Commands.Authorize;

export const AuthorizeCommand: Command = (message: Discord.Message) => {
    message.channel.send(_.template(Strings.successResponse)(
        { authorizationUrl: SpotifyHelpers.createAuthorizationUrl() }),
        { reply: message.author });
};