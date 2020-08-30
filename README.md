# Discord-bot

Casual Basic Music Playing bot.

This Bot currently paused in development because my Raspberry Pi Zero server is not competitable with Node V12, so some features was not able to be deploy correctly. 

## Bot Info

There are many discord bot, this, is no special. I am trying to develop a bot for my friends and in my own discord server, hosting it myself. 

### Function 

- Customise Message
- Customise command name
- Music Bot (Play, pause, stop, queue, lyrics etc)
- Reminder (Direct Message you or targetted role)
- Todo list
- Covid Cases and news for Victoira, Ausralia.

## Set-UP 

- Part 1 - Get discord bot from discord developer portal
- Part 2 - Set up the bot from this repo
### Part 1 - Get discord bot from discord developer portal

1.  Head to [https://discord.com/developers/](https://discord.com/developers/) and sart a new application.
2. On the left sidebar, select "Bot", then "Add a bot" 
3. Make note on the Token on Bot page, you will need that later. 
4. Inviting you bot to your server. The url to invite the bot to your server is something like this, but the client id will be your own. [https://discord.com/oauth2/authorize?client_id=1111111&scope=bot](https://discord.com/oauth2/authorize?client_id=111111&scope=bot). Client Id can be found on Discord Developers - General Information page. 

### Part 2 - Set up the bot from this repo

1. Install all packages

`npm i`


2. Create `config.json` with like the following, you can customise your prefix here.

```
{
	"TOKEN":"xxxxx",
	"GENIUSAPIKEY":"xxxxx",
	"PREFIX": "!",
	"AUDIO_QUALITY":"lowest", 
}
```


3. Getting Genius api key from https://docs.genius.com/

