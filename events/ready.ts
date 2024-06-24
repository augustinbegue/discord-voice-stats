import { readFileSync, writeFileSync } from 'fs';
import { ActivityType, ChannelType, Guild, User } from 'discord.js';
import config from '../config.json'
import { onUserJoin } from "../utils/stats";
import { Bot } from '../utils/types';

export default function (client: Bot) {
    console.log(`Logged in as ${client.user?.tag}`);

    // Set the activity of the bot
    client.user?.setActivity('Je vous surveille', {
        type: ActivityType.Custom,
    });

    // Init data file
    const guildIds = Object.keys(config);
    guildIds.forEach((guildId) => {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return;

        console.log('Init data for guild', guild.name);


        const voiceChannels = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice);

        voiceChannels.forEach((channel) => {
            if (channel.type !== ChannelType.GuildVoice) return;

            channel.members.forEach((member) => {
                onUserJoin(member.user);
            });
        });
    })
}
