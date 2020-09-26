const { Command } = require('discord.js-commando');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const headers = {
	Authorization: `Bearer ${CONFIGS.GENIUSAPIKEY}`
};
module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lyrics',
			group: 'music',
			memberName: 'lyrics',
			description: 'Search Lyrics of the music',
			guildOnly: true,
			args: [
				{
					key: 'songName',
					prompt: 'Lyrics Search word',
					type: 'string',
					default: 'default'
				},
			],
		});
	}

	async run(message, { songName }) {
		if (songName == 'default') {
			songName = message.guild.musicData.nowPlaying
		} else {
			songName = songName.replace(/ *\([^)]*\) */g, '');
		}
		var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;
		try {
			var body = await fetch(url, { headers });
			var result = await body.json();
			const songPath = result.response.hits[0].result.api_path;
			url = `https://api.genius.com${songPath}`;
			body = await fetch(url, { headers });
			result = await body.json();
			const song = result.response.song;
			let lyrics = await getLyrics(song.url);
			lyrics = lyrics.trim()
			lyrics = lyrics.replace(/(\[.+\])/g, '');
			var arr = cutLyrics([lyrics])
			arr.forEach(msg => {
				message.say(msg)
			})
		} catch (e) { console.log(e) }

		async function getLyrics(url) { //get lyrics from external site. 
			const response = await fetch(url); //went wrong on this fetch
			const text = await response.text();
			const $ = cheerio.load(text); //parse the from html to something more readable
			return $('.lyrics').text()
		}

		function cutLyrics(lyrics) {  //Not the ideal way to do i,but since discord only allow 2000 char, need to cut them in smaller chunk... Require rework
			if (lyrics[0].length > 1500) {
				lyrics.push(lyrics[0].substring(0, 1500))
				lyrics[0] = lyrics[0].substring(1500)
				return cutLyrics(lyrics)
			}
			lyrics.push(lyrics.shift())
			return lyrics
		}
	}
};
