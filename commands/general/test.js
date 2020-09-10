const { Command } = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class TestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'test',
			group: 'general',
			memberName: 'test',
			description: 'Get a random Image from unsplash',
			guildOnly: false,
			userPermissions:['ADMINISTRATOR']
		});
	}

	async run(message, { keyword }) {
		const ImageEmbed = new Discord.MessageEmbed()
		ImageEmbed
			.setTitle('Photo of Link')
			.setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.lygNuKyE3SO_9nDG5tCYmwHaK_%26pid%3DApi&f=1')
			.setURL('https://www.google.com')
			.setDescription('aaa')
		const sentMsg = await message.reply(ImageEmbed)
	}
};
