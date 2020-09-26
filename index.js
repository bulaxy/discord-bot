const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { Structures } = require('discord.js');
const fs = require('fs');
const welcomeMessage = require('./botmessagers/welcomeMessage');
const publicIp = require('public-ip');
var numAttempt = 0;
_ = require('lodash');
moment = require('moment');
helpers = require('./helper');
CONFIGS = require('./config.json');
CONSTANTS = require('./constants.json');
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

client = new CommandoClient({
	commandPrefix: CONFIGS.PREFIX,
	owner: CONFIGS.OWNERID,
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
	console.log(`Online... numAttempt ${numAttempt}`);
	try {
		clearInterval(setUpConnection);
	} catch (e) {
		// console.error(e)
	}
	client.user.setActivity('', { type: 'I am a stupid Chicken' });
	compareIp()
	setInterval(compareIp, 900000)
});


//You can do this within server setting, but yolo
// client.on('guildMemberAdd', member => {
// 	if (CONFIGS.doWelcomeMsg=="true") {
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

var setUpConnection = setInterval(function(){
	console.log('Connection Attempt')
	client.login(CONFIGS.TOKEN)
	numAttempt = numAttempt++
}, 60000)
client.login(CONFIGS.TOKEN)


async function compareIp() {
	var newip = await publicIp.v4()
	fs.readFile(CONFIGS.IPFilePath, 'utf-8', function (err, data) {
		if (err)
			return console.log(err);
		if (data != newip) {
			client.users.fetch(CONFIGS.OWNERID).then(function (user) { user.send('Ip changed:' + newip) })
			fs.writeFile(CONFIGS.IPFilePath, newip, { encoding: 'utf-8' }, function (err, data) {
				if (err)
					console.error(err)
			});
		}
	});

}
