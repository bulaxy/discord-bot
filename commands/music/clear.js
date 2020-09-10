const { Command } = require('discord.js-commando');
const MUSIC_CONSTANTS = require('../../botmessagers/music.json')

module.exports = class ClearCommand extends Command {
	constructor(client) {
		super(client, {
			name: MUSIC_CONSTANTS.clear_command,
			group: 'music',
			memberName: 'clear',
			description: MUSIC_CONSTANTS.clear_description,
			guildOnly: true,
		});
	}

	run(message) {
		if (message.guild.musicData.queue.length == 0) { //if not playing
			message.say(MUSIC_CONSTANTS.no_song_for_clear)
		} else {
			message.guild.musicData.queue = []
			message.say(MUSIC_CONSTANTS.cleared)
		}
	}
};


