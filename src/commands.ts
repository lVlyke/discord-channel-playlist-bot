import { Command } from "./command";
import { SayCommand } from "./commands/say";
import { SubscribeCommand } from "./commands/subscribe";
import { ForceUserPlaylistUpdateCommand } from "./commands/force-user-playlist-update";

export const Commands: { [commandName: string]: Command } = {
    "say": SayCommand,
    "subscribe": SubscribeCommand,
    "force-user-playlist-update": ForceUserPlaylistUpdateCommand
};