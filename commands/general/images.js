const { Command } = require('discord.js-commando');
const Unsplash = require('unsplash-js').default;
const { toJson } = require('unsplash-js');
const Discord = require('discord.js');
const unsplash = new Unsplash({ accessKey: CONFIGS.UNSLASH_ACCESS_KEY });
module.exports = class CovidCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'images',
			group: 'general',
			memberName: 'images',
			description: 'Get a random Image from unsplash',
			guildOnly: false,
			args: [
				{
					key: 'keyword',
					prompt: 'Image Search keyword',
					type: 'string',
				},
			],
			userPermissions: ['ADMINISTRATOR']
		});
	}

	async run(message, { keyword }) {
		const ImageEmbed = new Discord.MessageEmbed()
		const sentMsg = await message.reply(`Looking for images of ${keyword}`)
		unsplash.search.photos(keyword)
			.then(toJson)
			.then(json => {
				var pagenumber = Math.floor((Math.random() * json.total_pages) + 1);
				unsplash.search.photos(keyword, pagenumber)
					.then(toJson)
					.then(json2 => {
						var imagenumber = Math.floor((Math.random() * json2.results.length) + 1);
						var info = json2.results[imagenumber]
						const ImageEmbed = new Discord.MessageEmbed()
						ImageEmbed
							.setTitle(keyword)
							.setURL(info.links.html)
							.setImage(json2.results[imagenumber].urls.small)
							.setFooter(`Photo by ${info.user.first_name} ${info.user.last_name} on Unsplash see full size image and download on ${info.links.html}`)
						sentMsg.edit(ImageEmbed)
					});
			});
	}
};
