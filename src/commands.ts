import { Command } from "./command";
import { SayCommand } from "./commands/say";
import { SubscribeCommand } from "./commands/subscribe";
import { AuthorizeCommand } from "./commands/authorize";
import { RegisterTokenCommand } from "./commands/register-token";

export const Commands: { [commandName: string]: Command } = {
    "say": SayCommand,
    "subscribe": SubscribeCommand,
    "authorize": AuthorizeCommand,
    "register-token": RegisterTokenCommand
};