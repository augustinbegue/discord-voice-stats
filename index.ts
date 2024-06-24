import { GatewayIntentBits, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder, REST, Routes, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Bot } from './utils/types.d';

const client = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ],
});
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

/**
 * Register Events
 */
const eventsPath = join(import.meta.dir, 'events');
console.log(`Loading events from ${eventsPath}`);
const eventFiles = readdirSync(eventsPath);

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = require(filePath);

    if (typeof event.default === 'function') {
        client.on(file.split('.')[0], event.default.bind(null, client));
    } else {
        console.log(`[WARNING] The event at ${filePath} is not a function.`);
    }
}

/**
 * Register Commands
 */
client.commands = new Collection();
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const foldersPath = join(import.meta.dir, 'commands');
console.log(`Loading commands from ${foldersPath}`);

const commandFiles = readdirSync(foldersPath);

for (const file of commandFiles) {
    const filePath = join(foldersPath, file);
    const command = require(filePath) as { data: SlashCommandBuilder, execute: any };

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

/**
 * Deploy Commands
 */
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
            { body: commands },
        ) as RESTPostAPIChatInputApplicationCommandsJSONBody[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.login(process.env.DISCORD_TOKEN);
