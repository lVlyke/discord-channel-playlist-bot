import * as Discord from "discord.js";
import { Command } from "../command";

export const HelpCommand: Command = (message: Discord.Message, ..._args: string[]) => {
    message.channel.send("This bot allows you to subscribe to music posted to any Discord channel from Spotify. A playlist will be periodically created on your Spotify account with all of the tracks posted to this channel in that time.");
    message.channel.send("To get started, you need to authorize me to manage the playlist for you. To do this, **@Mention** me and say `authorize <your Spotify User ID>`.");

    // TODO - List all commands
};