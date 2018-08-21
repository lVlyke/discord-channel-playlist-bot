import * as Discord from "discord.js";
import { Command } from "../command";
import { logger } from "../logger";

export const SayCommand: Command = (message: Discord.Message, ...args: string[]) => {
    // send args to channel as message
    message.channel.send(args.join(" "));

    logger.info(`Said: ${args.join(" ")}`);
};