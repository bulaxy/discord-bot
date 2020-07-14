const { Command } = require('discord.js-commando');

module.exports = class DiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dice',
			group: 'general',
			memberName: 'dice',
			description: 'You are rolling a d6 dice ',
		});
	}

	run(message) {
		var roll = Math.floor(Math.random() * 6) + 1
		return message.say("You have rolled " + roll);
	}
};
