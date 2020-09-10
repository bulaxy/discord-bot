
const { Command } = require('discord.js-commando');
const MUSIC_CONSTANTS = require('../../botmessagers/music.json')

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: MUSIC_CONSTANTS.stop_command,
			group: 'music',
			memberName: 'stop',
			description: MUSIC_CONSTANTS.stop_description,
			guildOnly: true,
		});
	}

	run(message) {
		if (message.guild.musicData.nowPlaying) { //if not playing
			message.guild.musicData.queue = []
			message.guild.musicData.nowPlaying = null
			message.guild.voice.connection.disconnect() //Leave channel
			message.guild.musicData.dispatcher.end()    
			message.say(MUSIC_CONSTANTS.stopped)
		} else {
			message.say(MUSIC_CONSTANTS.no_song_is_playing)
			// message.say(CONSTANTSTEXT.ALREADY_STOPPED)
		}
	}
};
