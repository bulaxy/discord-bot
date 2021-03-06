const { Command } = require('discord.js-commando');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { forEach } = require('lodash');

module.exports = class CovidNewsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'covidnews',
			group: 'general',
			memberName: 'covidnews',
			description: 'Get latest Covid-19 News from Vistoria today (update subject to  https://www.dhhs.vic.gov.au/coronavirus-covid-19-daily-update)',
			guildOnly: false,
			args: [
				// {
				// 	key: 'songName',
				// 	prompt: 'Lyrics Search word',
				// 	type: 'string',
				// 	default: 'default'
				// },
			],
		});
	}

	async run(message) {
		const sentMsg = await message.say('Retreiving Informations')
		var body = await fetch('https://www.dhhs.vic.gov.au/coronavirus-covid-19-daily-update');
		var text = await body.text()
		var $ = cheerio.load(text)
		var date = $('.purple-pullout').text()
		var info = $('.field--name-field-dhhs-rich-text-text ul')
		var nodes = info.toArray()[0].childNodes
		var data = []
		nodes.forEach(node=>{
			if(node.childNodes && node.name =='li'){
				var string = ''
				node.childNodes.forEach(grantchildnode =>{
					if(grantchildnode.type == 'text'){
						string += grantchildnode.data
					}else{
						grantchildnode.childNodes.forEach(grandgrandchildnode =>{
							if(grandgrandchildnode.type == 'text'){
								string += grandgrandchildnode.data
							}
						})
					}
				})
				data.push(string)
			}else{
				//skip
			}
		})
		var reply = `Latest Info (${date})`
		data.forEach(text=>{
			reply += "\n -" + text
		})
		sentMsg.edit(reply)
	}
};
