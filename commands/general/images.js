const { Command } = require('discord.js-commando');
const Unsplash = require('unsplash-js').default;
const { toJson } = require('unsplash-js');
const unsplash = new Unsplash({ accessKey: configs.UNSLASH_ACCESS_KEY });
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
		});
	}

	async run(message, { keyword }) {
		const sentMsg = await message.reply(`One Sec, I am slow, looking for images of ${keyword}`)
		unsplash.search.photos(keyword)
			.then(toJson)
			.then(json => {
				var pagenumber = Math.floor((Math.random() * json.total_pages) + 1);
				console.log(json)
				unsplash.search.photos(keyword, pagenumber)
					.then(toJson)
					.then(json2 => {
						var imagenumber = Math.floor((Math.random() * json2.results.length) + 1);
						sentMsg.edit(json2.results[imagenumber].urls.small)
					});
			});
	}
};
