const Discord = require('discord.js');
const client = new Discord.Client();
const cheerio = require('cheerio');
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const fetch = require('node-fetch');
const _ = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment')
const CONSTANTSTEXT = require('./constants')
const config = require('./config')
var servers = {};
var loop = false;
var reminders = [];
var todo = [];
const headers = {
	Authorization: `Bearer ${config.GENIUSAPIKEY}`
};
const ONEHOUR = 3600000; 

client.on('ready', async () => {
	console.log('***** Online!')
	readReminder()
})

client.on('message', async message => {
	if (message.content.charAt(0) == config.PREFIX) {
		try {
			let args = message.content.substring(config.PREFIX.length).split(" ")
			switch (args[0].toLowerCase()) {
				case 'h':
				case 'help':
					message.channel.send(CONSTANTSTEXT.HELP_TEXT)
					break;
				case CONSTANTSTEXT.PLAY:
					function play(connection, message) {
						var server = servers[message.guild.id]
						var nextPlayingText = (_.isUndefined(server.queue[1])) ? "" : CONSTANTSTEXT.NEXT_SONG + server.queue[1].title //append next song.
						message.channel.send(CONSTANTSTEXT.NOW_PLAYING + server.queue[0].title + nextPlayingText)
						server.dispatcher = connection.play(ytdl(server.queue[0].url, { quality: config.AUDIO_QUALITY, filter: "audioonly" })) //set dispatcher to the song received.
						server.currentSong = server.queue.shift();	//Remove current song from queue and add it to currentSong
						server.dispatcher.on("finish", function () { //Listen to when song finish.
							console.log("***** Finished current song")
							if (server.queue[0]) { //if queue is not empty, play the next song
								play(connection, message)
							} else {
								message.channel.send(CONSTANTSTEXT.NO_SONG_IN_QUEUE)
								connection.disconnect()
							}
						});
					}
					if (!args[1]) { //check song attachment
						message.channel.send(CONSTANTSTEXT.ATTACH_LINK)
						console.log("***** No Link")
						return
					}

					if (!message.member.voice.channel) { //check user voice channel
						message.channel.send(CONSTANTSTEXT.MUST_JOIN_VOICE_CHANNEL)
						console.log("***** Must be in voice channel")
						return
					}

					if (!servers[message.guild.id]) { //if server not recognize, set up queue to server. 
						servers[message.guild.id] = { queue: [] }
					}
					var server = servers[message.guild.id]

					try {
						if (args[1].includes('.com/playlist')) {
							var ytl = await ytpl(args[1])
							ytl.items.forEach(item => {
								server.queue.push({ //add each song in playist to queue
									url: item.url,
									title: item.title,
									lengthSecond: getSecond(item.duration)
								})
							})
						} else {
							if (!args[1].includes('https://') && !args[1].includes('http://')) { //if not url it is search
								var searchTerm = message.content.substring(CONSTANTSTEXT.PLAY.length + config.PREFIX.length + 1, message.content.length);
								var ytl = await ytsr(searchTerm)
								ytl = ytl.items.find(item => item.type == 'video').link
							} else {
								//if not a playlist or a search, it is just a single video link
								ytl = args[1]
							}
							console.log("***** received Play, loading basic Info")
							var basicInfo = await ytdl.getBasicInfo(ytl) //get basic info,
							server.queue.push({ //add to queue
								url: ytl,
								title: basicInfo.player_response.videoDetails.title,
								lengthSecond: basicInfo.player_response.videoDetails.lengthSeconds,
							})
						}
					} catch (e) {
						message.channel.send(CONSTANTSTEXT.YTVideoNotFound)
						console.log(e)
						break;
					}

					if (!isInVoiceChannel(message)) { //if not in voice channel, start the play function 
						console.log("***** Joining Voice Channel")
						message.member.voice.channel.join().then(function (connection) {
							play(connection, message)
						})
						break;
					}
					if (isDispatcherRunning(message)) { //if already playing, 
						message.channel.send(CONSTANTSTEXT.ADD_TO_QUEUE)
						console.log(`***** Added to Queue`)
						break;
					}
					message.channel.send(CONSTANTSTEXT.FAILED_UNKNOWN)
					console.log(`***** ${args[0]} Failed`)
					break;

				case CONSTANTSTEXT.SKIP:
					var server = servers[message.guild.id]
					if (_.isUndefined(server)) { //check server defined or not. 
						message.channel.send(CONSTANTSTEXT.SERVER_NOT_JOINED)
						console.log(`***** ${args[0]} failed - server not joined`)
						break;
					}
					if (server.dispatcher) { //if dispatcher is defined, end it. can possible use isDispatcherRunning instead, dont think it will make a difference tho.
						server.dispatcher.end()
						break
					}
					message.channel.send(CONSTANTSTEXT.FAILED_UNKNOWN)
					console.log(`***** ${args[0]} Failed`)
					break;

				case CONSTANTSTEXT.STOP:
					var server = servers[message.guild.id]
					if (_.isUndefined(server)) { //check server defined or not. 
						message.channel.send(CONSTANTSTEXT.SERVER_NOT_JOINED)
						console.log(`***** ${args[0]} failed - server not joined`)
						break;
					}
					if (isInVoiceChannel(message)) { //check if it is in voice channel 
						if (isDispatcherRunning(message)) { //if it is in voice channel, and is running to avoiding server.dispatcher.end() error
							if (server.queue) server.queue = []
							server.dispatcher.end()    //End dispatcher (!play function should receive .on('finish'))
							message.guild.voice.connection.disconnect() //Leave channel
							message.channel.send(CONSTANTSTEXT.STOPPED)
							console.log("***** stopped")
						} else {
							message.channel.send(CONSTANTSTEXT.ALREADY_STOPPED)
							console.log("***** Already Stopped")
						}
					} else {
						message.channel.send(CONSTANTSTEXT.ALREADY_STOPPED)
						console.log("***** Already Stopped")
					}
					break;

				case CONSTANTSTEXT.CLEAR:
					var server = servers[message.guild.id]
					if (_.isUndefined(server)) {
						//to ensure no error during clear and server have been previously joined, otherwise no need for this if statement
					} else {
						server.queue = [] //reset queue
					}
					message.channel.send(CONSTANTSTEXT.CLEARED)
					console.log("***** clear")
					break;
				case CONSTANTSTEXT.QUEUE:
					var server = servers[message.guild.id]
					if (_.isUndefined(server)) { //Ensure server is not empty, prevent errors. 
						message.channel.send(CONSTANTSTEXT.SERVER_NOT_JOINED)
						console.log(`***** ${args[0]} failed - server not joined`)
						break;
					} else if (server.queue.length == 0) {   //check if queue is empty, says it is empty
						message.channel.send(CONSTANTSTEXT.EMPTY_QUEUE)
						console.log("***** Empty Queue")
						break
					} else {
						var tempText = CONSTANTSTEXT.QUEUE_TEXT
						var length = (server.queue.length > 5) ? 5 : server.queue.length //loop 5 times to display
						for (var i = 0; i < length; i++) {
							var duration = toHHMMSS(server.queue[i].lengthSecond)
							tempText = tempText + `\n ${i + 1}: ${server.queue[i].title} (${duration}),`
						}
						tempText.slice(0, -1) //remove last ', '
						var sumDuration = 0
						for (var i = 0; i < server.queue.length; i++) {
							sumDuration += server.queue[i].lengthSecond
						}
						tempText = tempText + `\n \n ${server.queue.length}${CONSTANTSTEXT.TOTAL_SONG_IN_QUEUE}${toHHMMSS(sumDuration)}`
						message.channel.send(tempText)
						console.log("***** Queue ", server.queue)
						break
					}
				case CONSTANTSTEXT.PAUSE:
					var server = servers[message.guild.id]
					if (_.isUndefined(server)) { //Ensure server is not empty, prevent errors. 
						message.channel.send(CONSTANTSTEXT.SERVER_NOT_JOINED)
						console.log(`***** ${args[0]} failed - server not joined`)
						break;
					}
					if (!isDispatcherRunning(message)) { //if not playing
						message.channel.send(CONSTANTSTEXT.NO_SONG_PLAYING)
						console.log(`***** Pause FAILED -  no song is playing`)
						break
					} else if (!server.dispatcher.paused) { //if playing and paused
						server.dispatcher.pause()
						message.channel.send(CONSTANTSTEXT.PAUSING)
						console.log(`***** Pausing`)
						break;
					} else {
						message.channel.send(CONSTANTSTEXT.ALREADY_PAUSED)
						console.log(`***** Pause FAILED - already paused`)
						break
					}
					message.channel.send(CONSTANTSTEXT.FAILED_UNKNOWN)
					console.log(`***** ${args[0]} Failed`)
					break;
				case CONSTANTSTEXT.RESUME:
					var server = servers[message.guild.id]
					if (_.isUndefined(server)) {
						message.channel.send(CONSTANTSTEXT.SERVER_NOT_JOINED)
						console.log(`***** ${args[0]} failed - server not joined`)
						break;
					}
					if (!isDispatcherRunning(message)) { //if not playing
						message.channel.send(CONSTANTSTEXT.NO_SONG_PLAYING)
						console.log(`***** Resuming FAILED -  no song is playing`)
						break
					} else if (server.dispatcher.paused) { //if playing and paused
						server.dispatcher.resume()
						message.channel.send(CONSTANTSTEXT.RESUMING)
						console.log(`***** Resuming`)
						break;
					} else {
						message.channel.send(CONSTANTSTEXT.ALREADY_PLAYING)
						console.log(`***** Resuming FAILED - already playing`)
						break
					}
				case CONSTANTSTEXT.REMINDER:
					var mentioned = [], roles = [], everyone = false
					message.mentions.users.forEach(mention => mentioned.push(mention.id)) //todo, restructure including names
					if (message.mentions.everyone) everyone = true
					message.mentions.roles.forEach(role => roles.push(role.id)) //todo restructure including names
					var obj = {
						date: args[1],
						time: args[2],
						title: args[3],
						everyone: everyone,
						roles: roles,
						members: mentioned
					}
					reminders.push(obj)
					setReminder()
					var filename = 'reminder.json'
					var file = fs.readFileSync(filename, 'utf-8');
					var data = (file == 0) ? [] : JSON.parse(file)
					data.push(obj)
					var stringify = JSON.stringify(data)
					fs.writeFileSync(filename, stringify)
					break;
				case CONSTANTSTEXT.DICE:
					var roll = Math.floor(Math.random() * 6) + 1
					message.channel.send(CONSTANTSTEXT.DICEROLL + roll)
					break;
				case CONSTANTSTEXT.CREATETODO:
					todo.push({
						title: args[1],
						items: []
					})
					break;
				case CONSTANTSTEXT.ADDITEM:
					var description = ''
					for (var i = 3; i < args.length; i++) {
						description = description + args[i]
					}
					todo.forEach(i => {
						if (i.title == args[1]) {
							i.items.push({
								name: args[2],
								description: description
							})
						}
					})
					break;
				case CONSTANTSTEXT.CHECKTODO: {
					var msg = args[1]
					todo.forEach(i => {
						if (i.title == args[1]) {
							msg = i.title
							i.items.forEach(item => {
								msg = msg + '\n name' + item.name + ' \n item description' + item.description
							})
						}
						message.channel.send(msg)
					})
					break;
				}
				case CONSTANTSTEXT.LYRICS: {
					if (_.isUndefined(args[1])) {
						var songName = server.currentSong.title
					} else {
						var songName = message.content.substring(CONSTANTSTEXT.LYRICS.length + config.PREFIX.length + 1, message.content.length);
					}
					songName = songName.replace(/ *\([^)]*\) */g, '');
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
							message.channel.send(msg)
						})
					} catch (e) { console.log(e) }
				}
			}
		} catch (e) {
			console.log(`***** unknown error ${e}`)
			message.channel.send(CONSTANTSTEXT.FAILED_UNKNOWN)
		}
	}
})

client.login(config.TOKEN)

function isInVoiceChannel(message) {
	if (_.isUndefined(message.guild.voice)) {
		console.log("***** server not joined")
		message.channel.send(CONSTANTSTEXT.SERVER_NOT_JOINED)
		return false
	}
	if (_.isNull(message.guild.voice.channelID)) { //if voiceChannelId is defined, it is in a voice Channel
		console.log("***** server not joined (channelId)")
		message.channel.send(CONSTANTSTEXT.SERVER_NOT_JOINED)
		return false
	}
	return true
}

function isDispatcherRunning(message) {
	var dispatcher = servers[message.guild.id].dispatcher
	if (_.isUndefined(dispatcher)) { //undefined dispatcher means not playing and never played
		console.log("***** Undefined Dispatcher")
		return false
	}

	if (_.isUndefined(dispatcher._writableState)) {  //not sure when is this being undefined, but put it here in case
		console.log("***** Undefined Dispatcher (writable State")
		return false
	}

	if (dispatcher._writableState.destroyed) {   // If it is distory, of course, return true. Alternatively, maybe use ended or finished might be better?
		console.log("***** Dispatcher distoryed")
		return false
	}
	return true
}

function toHHMMSS(secs) { //ideally use momentjs, but will not use for the time being //TODO -- included momentjs
	var sec_num = parseInt(secs, 10)
	var hours = Math.floor(sec_num / 3600)
	var minutes = Math.floor(sec_num / 60) % 60
	var seconds = sec_num % 60

	return [hours, minutes, seconds]
		.map(v => v < 10 ? "0" + v : v)
		.filter((v, i) => v !== "00" || i > 0)
		.join(":")
}

async function readReminder() {
	var filename = 'reminder.json'
	var file = fs.readFileSync(filename, 'utf-8');
	if (file == 0) return null //if empty return  nothing
	var data = JSON.parse(file)
	data.forEach(row => {
		var roles = []
		var members = []
		if (row.members) row.members.forEach(member => members.push(member))
		row.members = members
		if (row.roles) row.roles.forEach(role => roles.push(role))
		row.roles = roles
		setReminder(row)
	})
}

async function setReminder(detail) { 
	//when it is loaded, get the time difference, and add setTimeout for each one to work as a reminder.
	var now = moment()
	var time = moment(detail.date + ' ' + detail.time, 'D/M/YYYY hh:mm')
	var diff = now.diff(time)
	if (diff < 0) {
	} else {
		detail.timeout = setTimeout(function () {
			timeoutAction(detail)
		}, diff)
	}
	reminders.push(detail)
}

function timeoutAction(detail) { //et each user and send message
	detail.uid.forEach(uid => {
		client.users.fetch(uid).then(user => user.send(reminds.time + ' ' + detail.title));
	})
}

function getSecond(time) {  //Simple Convertion from the ytl duation format to second.
	var args = time.split(':')
	switch (args.length) {
		case 3:
			return args[0].parseInt() * 60 * 60 + args[1].parseInt() * 60 + args[2].parseInt
		case 2:
			return args[1].parseInt() * 60 + args[2].parseInt
			break;
		case 1:
			return args[2].parseInt()
			break;
	}
}

async function getLyrics(url) { //get lyrics from external site. 
	const response = await fetch(url);
	const text = await response.text();
	const $ = cheerio.load(text); //parse the from html to something more readable
	return $('.lyrics')
		.text()
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