const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			group: 'music',
			memberName: 'queue',
			description: 'Queue',
			guildOnly: true,
		});
	}

	run(message) {
		if (message.guild.musicData.queue.length == 0) {   //check if queue is empty, says it is empty
			// message.say(CONSTANTSTEXT.EMPTY_QUEUE)
			message.say('empty queue')
			break
		} else {
			const embedText = new MessageEmbed()
			var queue = message.guild.queue, sumDuration = 0
			var length = (queue.length > 5) ? 5 : queue.length //loop 5 times to display

			for (var i = 0; i < length; i++) {
				var duration = helpers.toHHMMSS(queue[i].lengthSecond)
				embedText.addField(`${i + 1}: ${queue[i].title} (${duration})`, '')
			}

			var sumDuration = 0
			for (var i = 0; i < queue.length; i++) {
				sumDuration += queue[i].lengthSecond
			}
			embedText
				.setTitle('Queue')
				.setDescription(`${queue.length} in queue, total length of ${helpers.toHHMMSS(sumDuration)}`)
			message.say(embedText)
		}

	}
};

