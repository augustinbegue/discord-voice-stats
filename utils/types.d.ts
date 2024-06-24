import { SlashCommandBuilder, Interaction, Client, Collection } from "discord.js";

export interface StatsUser {
    totalTime: number;
    joinTime: number;
    inVoiceChannel: boolean;
}

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: Interaction) => Promise<void>;
}

export class Bot extends Client {
    commands: Collection<string, Command>;
}
