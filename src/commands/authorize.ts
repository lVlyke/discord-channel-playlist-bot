import * as Discord from "discord.js";
import { Command } from "../command";
import { SpotifyHelpers } from "../spotify";

export const AuthorizeCommand: Command = (message: Discord.Message, ...args: string[]) => {
    if (args.length < 1) {
        message.channel.send("In order to authorize, you need to provide your Spotify User ID.");
        return;
    }

    const [spotifyUserId] = [...args];

    if (!spotifyUserId) {
        message.channel.send("Invalid Spotify User ID.");
        return;
    }

    message.channel.send(`To authorize me to manage your channel playlists, follow this link: ${SpotifyHelpers.createAuthorizationUrl()}`);
};