const { Command } = require('discord.js-commando');
const MUSIC_CONSTANTS = require('../../botmessagers/music.json')
module.exports = class SkipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'skip',
			group: 'music',
			memberName: 'skip',
			description: 'Skip Music',
			guildOnly: true,
			args: [
				{
					key: 'index',
					prompt: 'Which Song do you want to skip?',
					type: 'integer',
					default: -1,
					validate: num => num == ,
				},
			],
		});
	}

	run(message, { index }) {
		if (index === -1) {
			if (message.guild.musicData.dispatcher) { //if not playing
				message.guild.musicData.dispatcher.end()   //if dispatcher is defined, end it. can possible use isDispatcherRunning instead, dont think it will make a difference tho.
				// message.say(CONSTANTSTEXT.STOPPED) //Do not need Skip Text since when it is skip, now playing text will appear.
			} else {
				// message.say(MUSIC_CONSTANTS.already_stopped) //Also dont need since if no song in queue, .end will happen
			}
		} else {
			var removed = message.guild.musicData.queue.splice(index - 1, 1)
			if (removed.length == 0) {
				//fail to remove
				message.say('No Song is on that position')
			} else {
				message.say(`${removed[0].title} have been removed`)
			}
		}
	}
};
