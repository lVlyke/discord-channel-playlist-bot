import * as Discord from "discord.js";
import * as _ from "lodash";
import { Command } from "../command";
import { Constants } from "../constants";
import { Commands } from "../commands";

export const Strings = Constants.Strings.Commands.Help;

export const HelpCommand: Command = (message: Discord.Message) => {
    const commandList = _.reduce(Commands, (str, _command, name) => str + `\`${name}\`\r\n`, "");

    message.channel.send(`${Strings.generalHelp[1]}\r\n\r\n${Strings.generalHelp[2]}\r\n\r\n${Strings.availableCommands}\r\n${commandList}`,
        { reply: message.author });
};