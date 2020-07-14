const { Command } = require('discord.js-commando');

module.exports = class ClearCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			group: 'music',
			memberName: 'clear',
			description: 'clear Music',
			guildOnly: true,
		});
	}

	run(message) {
		if (message.guild.musicData.queue.length == 0) { //if not playing
			message.say('No Song in queue')
		} else {
			message.guild.musicData.queue = []
			message.say('Cleared')
			// message.say(CONSTANTSTEXT.CLEARED)
		}
	}
};


