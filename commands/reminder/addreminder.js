const { Command } = require('discord.js-commando');

module.exports = class AddReminderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addreminder',
			group: 'reminder',
			memberName: 'addreminder',
			description: 'Adding Reminder',
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
				{
					key: 'description',
					prompt: 'What is the description reminder?',
					type: 'string',
				},
				{
					key: 'date',
					prompt: 'What is the date you woould like to set the reminder for?',
					type: 'string',
				},
				{
					key: 'time',
					prompt: 'What is the time you woould like to set the reminder for?',
					type: 'string',
				},
				{
					key: 'group',
					prompt: 'Whether is certain category',
					type: 'string',
					default: 'default'
				},
			],
		});
	}

	run(message, { name, description, date, time, group }) {
		var eventDate = moment(date + ' ' + time, 'DD/MM/yyyy hh:mm'), now = moment()
		var diff = eventDate.diff(now)
		if (diff > 0) {
			var timeout = setTimeout(function () {
				message.direct(name + ' ' + description)
			}, diff)
			message.guild.reminderList.events.push({
				name: name,
				description: description,
				eventDate: eventDate,
				timeout: timeout,
				group: group,
				canceled: false,
				passed: false
			})
			message.reply('Reminder added, the event is ' + eventDate.fromNow())
		} else {
			message.reply('Already gone')
		}
	}
};
