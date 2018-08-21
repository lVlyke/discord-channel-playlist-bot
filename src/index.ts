#!/usr/bin/env node

import "./polyfills";

import { discordClient } from "./discord";
import { Commands } from "./commands";
import { logger } from "./logger";
import { store } from "./data-store";
import { Playlist } from "./models/playlist";
import * as _ from "lodash";
import * as Discord from "discord.js";
import { ChannelPlaylistCollection } from "./models/channel-playlist-collection";

// Configuration values:
const messageOnPlaylistChange: boolean = true;
////

const SPOTIFY_URL_REGEX = /^https:\/\/open\.spotify\.com\/track\/([^\?\s]+)(\?[^\s]+)?$/i;

discordClient.on("ready", () => {
    logger.info(`Logged in as ${discordClient.user.tag}`);
});

discordClient.on("message", (message) => {
    const isBotMention: boolean = message.mentions.users.some(user => user.tag === discordClient.user.tag);

    if (isBotMention) {
        const [, command, ...args] = message.content.split(/\s+/);
        const commandFn = Commands[command];

        // Execute the command if it exists
        if (commandFn) {
            commandFn(message, ...args);
        }
        else {
            message.channel.send(`${[
                "I don't know what that is, I've never seen that.",
                "Beep boop, I'm just a bot.",
                "What?",
                "Cool."
            ][Math.floor(Math.random() * 4)]} You can say \`help\` to see a list of commands.`);
        }
    }
    else {
        const messageTokens = message.content.split(/\s+/);

        // Check if there are any Spotify songs in this message
        const spotifyUris = messageTokens.reduce<string[]>((uriList: string[], token: string) => {
            const regexMatch = SPOTIFY_URL_REGEX.exec(token);

            if (regexMatch && regexMatch.length > 1) {
                uriList.push(regexMatch[1]);
            }

            return uriList;
        }, []);

        if (!_.isEmpty(spotifyUris)) {
            let channelPlaylistCollection = store.get<ChannelPlaylistCollection>("channelPlaylistCollection") || {};
            let channelPlaylist: Playlist = channelPlaylistCollection[message.channel.id] || Playlist.create(<Discord.TextChannel>message.channel);
            
            // Add all Spotify URIs from the message to the playlist
            channelPlaylist.songUris.push(...spotifyUris);

            message.channel.send(`Your playlist is now: ${channelPlaylist.songUris.join(", ")}.`);
            
            // Update the collection
            channelPlaylistCollection[message.channel.id] = channelPlaylist;
            store.set<ChannelPlaylistCollection>("channelPlaylistCollection", channelPlaylistCollection);

            if (messageOnPlaylistChange) {
                message.channel.send("Your track(s) have been added to the playlist.");
            }
        }
    }
});