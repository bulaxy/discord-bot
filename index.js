const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const config = require('./config.json')
_ = require('lodash');
moment = require('moment');
helpers = require('./helper')
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
				loop: false
			};
			this.todo = {
				list: [],
			};
			this.reminderList = {
				events: [],
			};
			this.aaaaa = {
				queue: [],
				isPlaying: false,
				nowPlaying: null,
				songDispatcher: null,
				loop: false
			};
		}
	}
	return MusicGuild;
});

const client = new CommandoClient({
	commandPrefix: '!',
	owner: config.OWNERID,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['general', 'General Command Group'],
		['music', 'Music Command Group'],
		['todo', 'Todo List Command Group'],
		['reminder', 'Reminder Command Group'],
	])
	.registerDefaultGroups({
		Commands: false,
		Utility: false
	})
	.registerDefaultCommands({
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

//On Ready function
client.once('ready', () => {
	console.log(`Online...`);
});

client.on('guildMemberAdd', member => {

});

client.on('error', console.error);

client.login(config.TOKEN);

		// ['music', 'Music Command Group'],
		// ['todo', 'Todo List Command Group'],
		// ['reminder', 'Reminder Command Group'],