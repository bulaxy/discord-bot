const { Command } = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class cancelreminder extends Command {
	constructor(client) {
		super(client, {
			name: 'cancelreminder',
			group: 'reminder',
			memberName: 'cancelreminder',
			description: 'Cancel reminder',
			guildOnly: true,
			//  clientPermissions: ['ADMINISTRATOR'],
			// userPermissions: ['MANAGE_MESSAGES'],
			// ownerOnly: true,
			args: [
				{
					key: 'name',
					prompt: 'What is the name reminder?',
					type: 'string',
				},
			],
		});
	}

	run(message, { name }) {
		var i = _.findIndex(message.guild.reminderList.events, item => item.name == name)
		if (i == -1) {
			message.say('reminder not found')
		} else {
			if (message.guild.reminderList.events[i].canceled == true) {
				message.say('Reminder already canceled')
			} else {
				clearTimeout(message.guild.reminderList.events[i].timeout)
				message.guild.reminderList.events[i].canceled = true
				message.say('Reminder removed')
			}
		}
	}
};

