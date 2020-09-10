const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const config = require('./config.json')
const welcomeMessage = require('./botmessagers/welcomeMessage')
_ = require('lodash');
moment = require('moment');
helpers = require('./helper');
configs = require('./config.json')
CONSTANTS = require('./constants.json')
global.fetch = require('node-fetch');
//Structure for Music Bot (Per Guild)
Structures.extend('Guild', function (Guild) {
	class GuildInfo extends Guild {
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
		}
	}
	return GuildInfo;
});

const client = new CommandoClient({
	commandPrefix: config.PREFIX,
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
		Commands: true,
		Utility: true
	})
	.registerDefaultCommands({
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

//On Ready function
client.once('ready', () => {
	console.log(`Online...`);
	client.user.setActivity('', { type: 'I am a stupid Chicken' });
});


//You can do this within server setting, but yolo
// client.on('guildMemberAdd', member => {
// 	if (config.doWelcomeMsg=="true") {
// 		var msgText = welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)]
// 		try {
// 			msgText = msgText.replace('XXX_NAME', `<@${member.user.id}>`)
// 		} catch (e) {
// 			msgText = `Welcome <@${member.user.id}>`
// 		}
// 		member.guild.channels.cache
// 			.get(member.guild.systemChannelID)
// 			.send(msgText)
// 	}
// });

client.on('error', console.error);

client.login(config.TOKEN);

		// ['music', 'Music Command Group'],
		// ['todo', 'Todo List Command Group'],
		// ['reminder', 'Reminder Command Group'],