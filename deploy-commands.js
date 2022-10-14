import { assert } from '@firebase/util';
import { REST, SlashCommandBuilder, Routes } from 'discord.js';
import config from './config.json' assert {type:"json"};

const commands = [
	new SlashCommandBuilder().setName('xgame').setDescription('Registers a new game to this channel.'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(config.token);

rest.put(Routes.applicationCommands(config.clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);