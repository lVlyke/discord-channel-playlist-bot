import * as Discord from "discord.js";

const auth: any = require("../auth.json");

export const discordClient: Discord.Client = new Discord.Client();

// login
discordClient.login(auth.discord.token);