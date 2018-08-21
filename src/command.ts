import * as Discord from "discord.js";

export type Command = (message: Discord.Message, ...args: string[]) => Promise<void> | void;