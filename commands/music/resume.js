const { Command } = require('discord.js-commando');
const MUSIC_CONSTANTS = require('../../botmessagers/music.json')

module.exports = class ResumeCmmand extends Command {
	constructor(client) {
		super(client, {
			name: MUSIC_CONSTANTS.resume_command,
			group: 'music',
			memberName: 'resume',
			description: MUSIC_CONSTANTS.resume_description,
			guildOnly: true,
		});
	}

	run(message) {
		if (!message.guild.musicData.dispatcher) { //if not playing
			message.say(MUSIC_CONSTANTS.no_song_is_playing)
		} else if (!message.guild.musicData.isPlaying) { //if playing and paused
			message.guild.musicData.dispatcher.resume()
			message.guild.musicData.isPlaying = true
			// message.say(CONSTANTSTEXT.RESUMING)
			message.say(MUSIC_CONSTANTS.resuming)
		} else {
			// message.say(CONSTANTSTEXT.ALREADY_PLAYING)
			message.say(MUSIC_CONSTANTS.already_playng)
		}
	}
};

