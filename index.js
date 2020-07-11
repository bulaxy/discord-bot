const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const config = require('./config.json')
_ = require('lodash');
//Structure for Music Bot (Per Guild)
Structures.extend('Guild', function (Guild) {
	class MusicGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.musicData = {
				queue: [],
				isPlaying: false,
				nowPlaying: null,
				songDispatcher: null,
				volume: 1
			};
		}
	}
	return MusicGuild;
});

const client = new CommandoClient({
	commandPrefix: '!',
	owner: config.OWNERID,
});

//On Ready function
client.once('ready', () => {
	console.log(`Bot Raedy, Logged in as ${client.user.tag}! (${client.user.id})`);
});

client.login(config.TOKEN);

client.on('error', console.error);

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['first', 'Your First Command Group'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));