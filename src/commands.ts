import { Command } from "./command";
import { SayCommand } from "./commands/say";
import { SubscribeCommand } from "./commands/subscribe";
import { ForceUserPlaylistUpdateCommand } from "./commands/force-user-playlist-update";
import { AuthorizeCommand } from "./commands/authorize";
import { RegisterTokenCommand } from "./commands/register-token";

export const Commands: { [commandName: string]: Command } = {
    "say": SayCommand,
    "subscribe": SubscribeCommand,
    "authorize": AuthorizeCommand,
    "register-token": RegisterTokenCommand,
    "force-user-playlist-update": ForceUserPlaylistUpdateCommand
};