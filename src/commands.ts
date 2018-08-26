import { Command } from "./command";
import { SubscribeCommand } from "./commands/subscribe";
import { AuthorizeCommand } from "./commands/authorize";
import { RegisterTokenCommand } from "./commands/register-token";
import { HelpCommand } from "./commands/help";
import { UnsubscribeCommand } from "./commands/unsubscribe";

export const Commands: { [commandName: string]: Command } = {
    "authorize": AuthorizeCommand,
    "help": HelpCommand,
    "register-token": RegisterTokenCommand,
    "subscribe": SubscribeCommand,
    "unsubscribe": UnsubscribeCommand
};