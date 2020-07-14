const { Command } = require('discord.js-commando');
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');
const ytsr = require('ytsr');

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			group: 'music',
			memberName: 'play',
			description: 'Play Music',
			guildOnly: true,
			clientPermissions: ['SPEAK', 'CONNECT'],
			args: [
				{
					key: 'query',
					prompt: 'What song or playlist would you like to listen to?',
					type: 'string',
					validate: function (query) {
						return query.length > 0 && query.length < 200;
					}
				}
			]
		});
	}

	async run(message, { query }) {
		if (!message.member.voice.channel) { //check user voice channel
			// message.say(CONSTANTSTEXT.MUST_JOIN_VOICE_CHANNEL)
			message.say('not in voice chanel')
			return null
		}

		if (
			query.match(
				/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
			)
		) { //if is playlist
			var ytl = await ytpl(query)
			ytl.items.forEach(item => {
				message.guild.musicData.queue.push({ //add each song in playist to queue
					url: item.url,
					title: item.title,
					lengthSecond: getSecond(item.duration)
				})
			})
		} else if (!query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
			var searchTerm = message.content.substring(query); //TODO Check
			var ytl = await ytsr(searchTerm)
			ytl = ytl.items.find(item => item.type == 'video').link
		} else {
			//if not a playlist or a search, it is just a single video link
			ytl = query
		}
		console.log("***** received Play, loading basic Info")
		var basicInfo = await ytdl.getBasicInfo(ytl) //get basic info,
		message.guild.musicData.queue.push({ //add to queue
			url: ytl,
			title: basicInfo.player_response.videoDetails.title,
			lengthSecond: basicInfo.player_response.videoDetails.lengthSeconds,
		})
		if (message.guild.musicData.nowPlaying) { //if already playing, 
			// message.say(CONSTANTSTEXT.ADD_TO_QUEUE)
			message.say(`***** Added to Queue`)
		}
		if (_.isUndefined(message.guild.voice) || !message.guild.voice.channelID) { //if not in voice channel, start the play function 
			message.member.voice.channel
				.join()
				.then(function (connection) {
					PlayCommand.play(message)
				})
		}
	}

	static play(message) {
		const classThis = this; // use classThis instead of 'this' because of lexical scope below
		// var nextPlayingText = (_.isUndefined(server.queue[1])) ? "" : CONSTANTSTEXT.NEXT_SONG + server.queue[1].title //append next song.
		// message.channel.send(CONSTANTSTEXT.NOW_PLAYING + server.queue[0].title + nextPlayingText)
		message.guild.musicData.dispatcher = message.guild.voice.connection.play(ytdl(message.guild.musicData.queue[0].url, { quality: 'lowest', filter: "audioonly" })) //set dispatcher to the song received.
		message.guild.musicData.nowPlaying = true
		message.guild.musicData.queue.shift();	//Remove current song from queue and add it to currentSong
		message.guild.musicData.dispatcher.on("finish", function () { //Listen to when song finish.
			if (message.guild.musicData.queue[0]) { //if queue is not empty, play the next song
				classThis.play(message)
			} else {
				// message.channel.send(CONSTANTSTEXT.NO_SONG_IN_QUEUE)
				message.guild.voice.connection.disconnect() //Leave channel
			}
		});
	}
};
