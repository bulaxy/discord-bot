const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			group: 'music',
			memberName: 'pause',
			description: 'Pause Music',
			guildOnly: true,
		});
	}

	run(message) {
		if (!message.guild.musicData.dispatcher) { //if not playing
			message.say('No Song is playing')
			break
		} else if (message.guild.musicData.isPlaying) { //if playing and paused
			message.guild.musicData.dispatcher.pause()
			message.guild.musicData.isPlaying = false
			// message.say(CONSTANTSTEXT.RESUMING)
			message.say('Resuming')
			break;
		} else {
			// message.say(CONSTANTSTEXT.ALREADY_PLAYING)
			message.say('Already Paused')
			break
		}
	}
};


