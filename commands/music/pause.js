const { Command } = require('discord.js-commando');
const MUSIC_CONSTANTS = require('../../botmessagers/music.json')

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: MUSIC_CONSTANTS.pause_command,
			group: 'music',
			memberName: 'pause',
			description: MUSIC_CONSTANTS.pause_description,
			guildOnly: true,
		});
	}
	run(message) {
		if (!message.guild.musicData.dispatcher) { //if not playing
			message.say(MUSIC_CONSTANTS.no_song_is_playing)
		} else if (message.guild.musicData.isPlaying) { //if playing and paused 
			message.guild.musicData.dispatcher.pause()
			message.guild.musicData.isPlaying = false
			message.say(MUSIC_CONSTANTS.pausing)
		} else {
			message.say(MUSIC_CONSTANTS.paused)
		}
	}
};


