import { VoiceState, ChannelType } from "discord.js";
import { onUserJoin, onUserLeave } from "../utils/stats";
import config from '../config.json'
import { Bot } from "../utils/types";

export default function (client: Bot, oldState: VoiceState, newState: VoiceState) {
    const user = newState.member?.user;
    if (!user) return;

    const guild = newState.guild;
    const annonceChannel = guild.channels.cache.get(config[guild.id]);

    if (!annonceChannel || annonceChannel.type !== ChannelType.GuildText) return;


    // Send message if user leave a voice channel
    if (oldState.channel && (!newState.channel || oldState.channel.id !== newState.channel.id)) {
        annonceChannel?.send(`${user.username} a quitté le channel vocal ${oldState.channel.name}`);
        onUserLeave(guild, user);
    }

    // Send message if user join a voice channel
    if (newState.channel && (!oldState.channel || oldState.channel.id !== newState.channel.id)) {
        annonceChannel?.send(`${user.username} a rejoint le channel vocal ${newState.channel.name}`);
        onUserJoin(user);
    }
}
