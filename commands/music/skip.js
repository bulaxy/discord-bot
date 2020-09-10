const { Command } = require('discord.js-commando');
const MUSIC_CONSTANTS = require('../../botmessagers/music.json')
module.exports = class SkipCommand extends Command {
	constructor(client) {
		super(client, {
			name: MUSIC_CONSTANTS.skip_command,
			group: 'music',
			memberName: 'skip',
			description: MUSIC_CONSTANTS.skip_description,
			guildOnly: true,
			args: [
				{
					key: 'index',
					prompt: MUSIC_CONSTANTS.skip_prompt,
					type: 'integer',
					default: -1,
				},
			],
		});
	}

	run(message, { index }) {
		if (index === -1) {
			if (message.guild.musicData.isPlaying) { //if not playing
				message.guild.musicData.dispatcher.end() //within play, when it end, it is 
			} else {
				message.say(MUSIC_CONSTANTS.no_song_is_playing)
			}
		} else {
			var removed = message.guild.musicData.queue.splice(index - 1, 1)
			if (removed.length == 0) {
				//fail to remove
				message.say(MUSIC_CONSTANTS.no_song_position)
			} else {
				message.say(removed[0].title + MUSIC_CONSTANTS.song_removed)
			}
		}
	}
};
