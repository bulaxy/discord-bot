
const { Command } = require('discord.js-commando');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			group: 'music',
			memberName: 'stop',
			description: 'Stop Music',
			guildOnly: true,
		});
	}

	run(message) {
		if (message.guild.musicData.dispatcher) { //if not playing
			message.guild.musicData.queue = []
			message.guild.musicData.dispatcher.end()    //End dispatcher (!play function should receive .on('finish'))
			// message.guild.voice.connection.disconnect() //Leave channel
			// message.say(CONSTANTSTEXT.STOPPED)
			message.say('Stopped')
		}else{
			nessage.say('No Song Playing')
			// message.say(CONSTANTSTEXT.ALREADY_STOPPED)
		}
	}
};
