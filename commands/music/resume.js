const { Command } = require('discord.js-commando');

module.exports = class ResumeCmmand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			group: 'music',
			memberName: 'resume',
			description: 'Resume Music',
			guildOnly: true,
		});
	}

	run(message) {
		if (!message.guild.musicData.dispatcher) { //if not playing
			message.say('No Song is playing')
			break
		} else if (!message.guild.musicData.isPlaying) { //if playing and paused
			message.guild.musicData.dispatcher.resume()
			message.guild.musicData.isPlaying = true
			// message.say(CONSTANTSTEXT.RESUMING)
			message.say('Resuming')
			break;
		} else {
			// message.say(CONSTANTSTEXT.ALREADY_PLAYING)
			message.say('Already playing')
			break
		}
	}
};

