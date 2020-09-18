const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const publicIp = require('public-ip');
module.exports = class IpCommand extends Command {
        constructor(client) {
                super(client, {
                        name: 'ip',
                        group: 'general',
                        memberName: 'ip',
                        description: 'get IP address',
                        guildOnly: false,
                        userPermissions:['ADMINISTRATOR']                                                                               });
        }

       async run(message) {
		message.reply(await publicIp.v4());
	}
};

