const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const MUSIC_CONSTANTS = require('../../botmessagers/music.json')
module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: MUSIC_CONSTANTS.play_command,
			group: 'music',
			memberName: 'play',
			description: MUSIC_CONSTANTS.play_description,
			guildOnly: true,
			clientPermissions: ['SPEAK', 'CONNECT'],
			args: [
				{
					key: 'query',
					prompt: MUSIC_CONSTANTS.play_prompt,
					type: 'string',
					validate: function (query) {
						return query.length > 0 && query.length < 200;
					}
				}
			]
		});
	}

	async run(message, { query }) {
		//First check whether the user is in a voice channel, TODO: if in voice channel,make sure is the same as the one the bot is in.
		if (!message.member.voice.channel) {
			message.say(MUSIC_CONSTANTS.user_not_in_voice_channel)
			return null
		}
		const sentMsg = await message.say(MUSIC_CONSTANTS.searching_for_song)
		var ytls = []
		try {
			switch (true) {
				case (query.includes('.com/playlist')): //If it is a playlist
					// sentMessage.edit(MUSIC_CONSTANT.searching_for_playlist);
					sentMsg.edit('playlist might take longer');
					var ytplInfo = await ytpl(query)
					ytplInfo.items.forEach(item => ytls.push(item.url))
					break;
				case ((!query.includes('https://') && !query.includes('http://'))): //If it is a search request
					var ytsrInfo = await ytsr(query)
					ytls.push(ytsrInfo.items.find(item => item.type == 'video').link)
					break;
				default:
					ytls = [query]
			}
			var basicInfo = await ytdl.getBasicInfo(ytls[0])
			message.guild.musicData.queue.push({ //add to queue
				url: ytls[0],
				title: basicInfo.player_response.videoDetails.title,
				lengthSecond: basicInfo.player_response.videoDetails.lengthSeconds,
				thumbnail: basicInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
				details: basicInfo.player_response.videoDetails, //in case, for future use or reference
			})
		} catch (e) {
			message.reply(MUSIC_CONSTANTS.fail_to_search_song)
		}
		//get the first song only, reduce wait time
		var basicInfo = await ytdl.getBasicInfo(ytls[0])
		message.guild.musicData.queue.push({ //add to queue
			url: ytls[0],
			title: basicInfo.player_response.videoDetails.title,
			lengthSecond: basicInfo.player_response.videoDetails.lengthSeconds,
			thumbnail: basicInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
			details: basicInfo.player_response.videoDetails, //in case, for future use or reference
		})

		if (_.isUndefined(message.guild.voice) || _.isNull(message.guild.voice.channelID) || !message.guild.musicData.isPlaying) { //if already playing, 
			//if not in voice channel, start the play function 
			message.member.voice.channel
				.join()
				.then(() => PlayCommand.play(message, sentMsg))
		} else {
			sentMsg.edit(MUSIC_CONSTANTS.added_to_queue)
		}
		//if more than 1 song, load in the other songs
		if (ytls.length > 0) {
			for (var i = 1; i < ytls.length; i++) {
				//Not sure how to primus.all
				var basicInfo = await ytdl.getBasicInfo(ytls[0]) //get basic info,
				message.guild.musicData.queue.push({ //add to queue
					url: ytls[i],
					title: basicInfo.player_response.videoDetails.title,
					lengthSecond: basicInfo.player_response.videoDetails.lengthSeconds,
					thumbnail: basicInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
					details: basicInfo.player_response.videoDetails, //in case, for future use or reference
				})
			}
		}
	}

	static play(message, sentMsg = null) {
		const classThis = this;
		message.guild.musicData.nowPlaying = message.guild.musicData.queue.shift()
		message.guild.musicData.isPlaying = true
		message.guild.musicData.dispatcher = message.guild.voice.connection.play(ytdl(message.guild.musicData.nowPlaying.url, { quality: 'lowest', filter: "audioonly" })) //set dispatcher to the song received.

		const nowPlayingEmbed = new Discord.MessageEmbed()
			.setColor(CONSTANTS.embedColor)
			.setTitle(MUSIC_CONSTANTS.now_play_title + message.guild.musicData.nowPlaying.title)
			.setURL(message.guild.musicData.nowPlaying.url)
			.setImage(message.guild.musicData.nowPlaying.thumbnail)

		if (_.isNull(sentMsg)) {
			message.say(nowPlayingEmbed)
		} else {
			sentMsg.edit(nowPlayingEmbed)
		}
		message.guild.musicData.dispatcher.on("finish", function () { //Listen to when song finish.
			message.guild.musicData.isPlaying = false
			if (message.guild.musicData.queue[0]) { //if queue is not empty, play the next song
				classThis.play(message)
			} else {
				message.say(MUSIC_CONSTANTS.no_song_in_queue)
				message.guild.musicData.nowPlaying = null
				message.guild.musicData.dispatcher = null
				message.guild.musicData.isPlaying = false
				if (message.guild.me.voice.channel) {
					return message.guild.me.voice.channel.leave();
				}
			}
		});
	}
};
