import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import { readFileSync } from "fs";
import { Bot, StatsUser } from "..";

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Affiche le leaderboard des membres les plus actifs en vocal');

function getLeaderboardData(client: Bot) {
    const data = readFileSync('data.json', 'utf8');
    const users = JSON.parse(data) as {
        [key: string]: StatsUser;
    };

    const leaderboard = Object.entries(users)
        .slice(0, 10);

    return leaderboard.map(([id, stats]) => {
        let totalTime = stats.totalTime;

        if (stats.inVoiceChannel) {
            totalTime += Date.now() - stats.joinTime;
        }

        return {
            user: id,
            totalTime
        };
    })
        .sort((a, b) => b.totalTime - a.totalTime)
        .map((entry, index) => {
            return {
                user: entry.user,
                totalTime: entry.totalTime,
                rank: index + 1,
            };
        });
}

export async function execute(interaction: ChatInputCommandInteraction) {
    const fields: APIEmbedField[] = [];

    const data = getLeaderboardData(interaction.client as Bot);
    data.forEach((entry) => {
        const hours = Math.floor(entry.totalTime / 1000 / 60 / 60);
        const minutes = Math.floor(entry.totalTime / 1000 / 60) - hours * 60;
        const seconds = Math.floor(entry.totalTime / 1000) - hours * 3600 - minutes * 60;

        fields.push({
            name: entry.rank === 1 ? `🥇` : entry.rank === 2 ? `🥈` : entry.rank === 3 ? `🥉` : `#${entry.rank}`,
            value: `${userMention(entry.user)}: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        });
    });

    const leaderboardEmbed = new EmbedBuilder()
        .setColor('#7a43a7')
        .setTitle('Top des chômeurs')
        .addFields(fields)
        .setTimestamp();

    await interaction.reply({
        embeds: [leaderboardEmbed],
    });
}
