import * as Discord from "discord.js";
import { Auth } from "./models/auth";

const auth: Auth = require("../auth.json");

export const discordClient: Discord.Client = new Discord.Client();

// login
discordClient.login(auth.discord.token);