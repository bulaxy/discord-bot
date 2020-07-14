const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { times } = require('lodash');

module.exports = class checkreminder extends Command {
	constructor(client) {
		super(client, {
			name: 'checkreminder',
			group: 'reminder',
			memberName: 'checkreminder',
			description: 'Check reminder',
			guildOnly: true,
			//  clientPermissions: ['ADMINISTRATOR'],
			// userPermissions: ['MANAGE_MESSAGES'],
			// ownerOnly: true,
			args: [
				{
					key: 'group',
					prompt: 'What is the name reminder?',
					type: 'string',
					default: 'all',
				},
			],
		});
	}

	run(message, { group }) {
		var list = (group == 'all') ? message.guild.reminderList.events : message.guild.reminderList.events.filter(event => event.group == group)
		const checkReminderEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle((group == 'all') ? 'All events' : name)
		if (list.length == 0) {
			checkReminderEmbed.addField('No events', ' - ')
		} else {
			list.forEach(item => {
				checkReminderEmbed
					.addField(item.name + ' (' + item.eventDate.fromNow() + ')', item.description, false)
			})
		}
		message.say(checkReminderEmbed)
	}
};

