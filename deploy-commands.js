import { REST, SlashCommandBuilder, Routes } from 'discord.js';

const commands = [
	new SlashCommandBuilder().setName('xgame').setDescription('Registers a new game to this channel.'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_JS_TOKEN);

rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);