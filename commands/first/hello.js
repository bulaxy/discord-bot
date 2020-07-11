const { Command } = require('discord.js-commando');

module.exports = class HelloCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hello',
			aliases: ['hi'],
			group: 'first',
			memberName: 'hello',
			description: 'Ping Pong!.',
			guildOnly: true,
			// clientPermissions: ['ADMINISTRATOR'],
			// userPermissions: ['MANAGE_MESSAGES'],
			// ownerOnly: true,
			// args: [
			// 	{
			// 		key: 'text',
			// 		prompt: 'What text would you like the bot to say?',
			// 		type: 'string',
			// 	},
			// 	{
			// 		key: 'otherThing',
			// 		prompt: 'What is this other useless thing?',
			// 		type: 'string',
			// 		default: 'dog',
			// 	},
			// ],
		});
	}

	run(message) {
		return message.say('Hello!');
	}
};