import * as Discord from "discord.js";
import moment = require("moment");
import { Config } from "./config";

const config: Config = require("../../config.json");

export interface Playlist {
    channelId: string;
    channelName: string;
    songUris: string[];
    lastCommitDate: string;
    lastUpdateDate?: string;
}

export namespace Playlist {

    export function create(channel: Discord.TextChannel): Playlist {
        return {
            channelId: channel.id,
            channelName: `${channel.guild.name} #${channel.name}`,
            songUris: [],
            lastCommitDate: new Date().toISOString()
        };
    }

    export function requiresUpdate(playlist: Playlist): boolean {
        return playlist.lastUpdateDate && 
        moment(playlist.lastUpdateDate).isAfter(playlist.lastCommitDate) &&
        moment().isAfter(moment(playlist.lastCommitDate).add(config.playlistUpdateFrequency, "seconds"));
    }
}