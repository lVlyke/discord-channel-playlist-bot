import * as Discord from "discord.js";
import { Command } from "../command";
import { Constants } from "../constants";

export const Strings = Constants.Strings.Commands.Help;

export const HelpCommand: Command = (message: Discord.Message, ..._args: string[]) => {
    message.channel.send(Strings.generalHelp[1]);
    message.channel.send(Strings.generalHelp[2]);

    // TODO - List all commands
};