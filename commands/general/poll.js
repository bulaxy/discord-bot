const { Command } = require('discord.js-commando');
var array = []
var emojireference = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣",
	"5️⃣",
	"6️⃣",
	"7️⃣",
	"8️⃣",
	"9️⃣",
	"🔟"
]
module.exports = class PollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'poll',
			group: 'general',
			memberName: 'poll',
			description: 'Make a poll, only up to 10 items',
			guildOnly: false,
		});
	}

	async run(message) {
		let content = message.content.substring(0)
		array = []
		recursiveLoop(content)
		var reply = ''
		if(array.length > 11) {
			return message.say('WTF, I told only 10')
		}
		array.forEach((ele, i) => {
			if (i == 0) {
				reply += '**' + ele + '**'
			} else {
				reply += '\n ' + emojireference[i - 1] + ' ' + ele
			}
		})
		const sentMessage = await message.say(reply)
		array.forEach((ele, i) => {
			if (i == 0) {
			} else {
				sentMessage.react(emojireference[i-1]);
			}
		})
	}
};

function recursiveLoop(string) {
	var start = string.indexOf('[') + 1
	var end = string.indexOf(']')
	if (start >= 0 && end > 0) {
		array.push(string.substring(start, end))
		var res = string.slice(end + 1, string.length)
		if (end != string.length)
			recursiveLoop(res)
	}
}