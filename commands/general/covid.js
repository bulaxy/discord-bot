const { Command } = require('discord.js-commando');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { forEach } = require('lodash');

module.exports = class CovidCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'covid',
			group: 'general',
			memberName: 'covid',
			description: 'Get latest Covid-19 Number of Cases from Vistoria today (update subject to  https://www.dhhs.vic.gov.au/coronavirus)',
			guildOnly: false,
			args: [
			],
		});
	}

	async run(message) {
		const sentMsg = await message.say('Retreiving Informations')
		var body = await fetch('https://www.dhhs.vic.gov.au/coronavirus');
		var text = await body.text()
		var $ = cheerio.load(text)
		var date = $('.updated').text()
		var info = $('.covid-number-box').first().text().replace(/(\[.+\])/g, '');
		info = info.replace(/\n/g, '').replace(/\t/g,'').trim()
		console.log(info)
		sentMsg.edit(`There are ${info} \n ${date} \n source: https://www.dhhs.vic.gov.au/coronavirus`)
	}
};
