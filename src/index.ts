#!/usr/bin/env node

import { discordClient, DiscordHelpers } from "./discord";
import { Commands } from "./commands";
import { logger } from "./logger";
import * as _ from "lodash";
import * as Discord from "discord.js";
import * as moment from "moment";
import { Auth } from "./models/auth";
import { store } from "./data-store";
import { ChannelPlaylistCollection } from "./models/channel-playlist-collection";
import { Config } from "./models/config";
import { SpotifyHelpers } from "./spotify";
import { Playlist } from "./models/playlist";
import { DataStore, Strings } from "./constants";
import { DataUtils } from "./utils/data-utils";

const auth: Auth = require("../auth.json");
const config: Config = require("../config.json");

export function main() {
    discordClient.on("error", logger.error);

    // login
    discordClient.login(auth.discord.token);

    discordClient.on("ready", () => {
        logger.info(`Logged in as ${discordClient.user.tag}`);

        // Manage all channels' playlists
        checkChannelListStatus();
    });
    
    discordClient.on("message", (message) => {
        // Analyze each user message that comes in
        if (message.author.id !== discordClient.user.id) {
            checkMessage(message);
        }
    });
}

export function checkMessage(message: Discord.Message) {
    const isBotMention: boolean = message.mentions.users.some(user => user.tag === discordClient.user.tag);

    if (isBotMention) {
        const [, command, ...args] = message.content.split(/\s+/);
        const commandFn = Commands[command];

        // Execute the command if it exists
        if (commandFn) {
            commandFn(message, ...args);
        }
        else {
            const errorPrefixes = Strings.CommandError.Prefixes;
            message.channel.send(`${errorPrefixes[Math.floor(Math.random() * errorPrefixes.length)]} ${Strings.CommandError.Response}`);
        }
    }
    else {
        if (message.channel instanceof Discord.TextChannel) {
            // Only monitor channels that are subscribed to
            if (DataUtils.isChannelSubscribedTo(message.channel.id)) {
                // Check for new tracks from users in the channel
                DiscordHelpers.checkForTracks(message);
            }
        } else if (message.channel instanceof Discord.DMChannel) {
            // If this is a DM, assume someone is registering a token
            Commands["register-token"](message, message.content);
        }
    }
}

async function checkChannelListStatus(): Promise<void> {
    // Get all managed channel playlists
    const channelPlaylistCollection = store.get<ChannelPlaylistCollection>(DataStore.Keys.channelPlaylistCollection) || {};

    for (const key in channelPlaylistCollection) {
        const playlist: Playlist = channelPlaylistCollection[key];
    
        // Check if enough time has elapsed to commit this channel's playlist to each subscribed user's Spotify account
        if (playlist && 
            playlist.lastUpdateDate && 
            moment(playlist.lastUpdateDate).isAfter(playlist.lastCommitDate) &&
            moment().isAfter(moment(playlist.lastCommitDate).add(config.playlistUpdateFrequency, "seconds"))
        ) {
            const channel = discordClient.channels.find(c => c.id === playlist.channelId) as Discord.TextChannel;

            if (!_.isEmpty(playlist.songUris)) {

                // Send notification (if enabled)
                if (channel && config.messageOnPlaylistCommit) {
                    channel.send(Strings.Notifications.messageOnPlaylistCommit);
                }

                // Update the users playlists
                try {
                    await SpotifyHelpers.updateChannelPlaylist(playlist);
                } catch (e) {
                    logger.error(e);
                    continue;
                }
            }

            if (config.keepOldPlaylistSongs) {
                // Update the last commit date
                channelPlaylistCollection[key].lastCommitDate = moment().toISOString();
            } else {
                // Re-initialize the list and remove all previous songs
                channelPlaylistCollection[key] = Playlist.create(channel);
            }
            
            store.set<ChannelPlaylistCollection>(DataStore.Keys.channelPlaylistCollection, channelPlaylistCollection);
        }
    }

    // Check for updates every 1000ms
    setTimeout(checkChannelListStatus, 1000);
    return Promise.resolve();
}

////

// Start the bot
main();