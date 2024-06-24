import { readFileSync, writeFileSync } from 'fs';
import { ChannelType, Guild, User } from 'discord.js';
import config from '../config.json'
import { StatsUser } from './types';

export function onUserJoin(user: User) {
    const data = readFileSync('data.json', 'utf8');
    const users = JSON.parse(data) as {
        [key: string]: StatsUser;
    };

    if (!users[user.id]) {
        users[user.id] = {
            totalTime: 0,
            joinTime: Date.now(),
            inVoiceChannel: true,
        };
    } else if (!users[user.id].inVoiceChannel) {
        users[user.id].joinTime = Date.now();
        users[user.id].inVoiceChannel = true;
    }

    writeFileSync('data.json', JSON.stringify(users, null, 2));
}

export function onUserLeave(guild: Guild, user: User) {
    const data = readFileSync('data.json', 'utf8');
    const users = JSON.parse(data) as {
        [key: string]: StatsUser;
    };

    if (users[user.id]) {
        users[user.id].totalTime += Date.now() - users[user.id].joinTime;
        users[user.id].inVoiceChannel = false;

        const annonceChannel = guild.channels.cache.get(config[guild.id]);
        if (!annonceChannel || annonceChannel.type !== ChannelType.GuildText) return;

        const hours = Math.floor(users[user.id].totalTime / 3600000);
        const minutes = Math.floor(users[user.id].totalTime / 60000) - hours * 60;
        const seconds = Math.floor(users[user.id].totalTime / 1000) - hours * 3600 - minutes * 60;
        annonceChannel.send(`${user.username} a passé **${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}** dans les channels vocaux`);

        writeFileSync('data.json', JSON.stringify(users, null, 2));
    }
}
