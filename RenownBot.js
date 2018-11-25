const DiscordBot = require('./DiscordBot.js');
const request = require('request-promise-native');

class RenownBot extends DiscordBot
{
	constructor()
	{
		super();
		this.renowns = {};
		this.userMap = {};
	}
	
	attachCommands()
	{
		super.attachCommands();
		this.attachCommand('readLocalFile', this.readLocalFile);
		this.attachCommand('readRemoteFile', this.readRemoteFile);
		this.attachCommand('register', this.register);
		this.attachCommand('renownCheck', this.renownCheck);
		this.attachCommand('deleteRenown', this.deleteRenown);
		this.addCommandAliases({
			'renownCheck':['checkRenown', 'check', 'renown']
		});
	}
	
	async hoist(client)
	{
		await super.hoist(client);
		for(let serverId in this.fileLocations)
		{
			await this.loadServerRenownFromCSV(serverId, this.fileLocations[serverId]);
		}
	}

	async getHelpText(guildId)
	{
		let prefix = this.getCommandPrefixForGuild(guildId);

		return [
			`This bot responds to messages starting with either ${prefix} or direct @DiscordBot mentions`,
			`To populate the bot with the renown details of player characters, a properly formatted CSV file is required. You can drag it onto any chat the bot is registered to and give it the command ${prefix}loadLocalFile. This will cause the details to be read and stored.`,
			`The renown details are stored by player membership number and character name. As such, a player must register with the bot using the ${prefix}register [membership number] command.`,
			`For example, if your membership number is 2018050005, you would register with the bot via \`${prefix}register 2018050005\``,
		];
	}
	
	getSettingsToSave()
	{
		let settingsToSave = super.getSettingsToSave();
		settingsToSave.userMap = this.userMap;
		settingsToSave.renowns = this.renowns;
		return settingsToSave;
	}
	
	async loadServerRenownFromCSV(serverId, csvURL)
	{
		return request.get(csvURL).then((csv)=> {
            this.renowns[serverId] = this.renowns[serverId] ? this.renowns[serverId] : {};
            let lines = csv.split('\n');
            // we don't care about the titles
            lines.shift();
            for (let line of lines) {
                let [number, name, cunning, glory, honor, purity, wisdom] = line.trim().split(',');
                this.renowns[serverId][number] = {
                    Cunning: cunning,
                    Glory: glory,
                    Honor: honor,
                    Purity: purity,
                    Wisdom: wisdom
                };
            }
        }).catch((err)=>{
			console.warn(err);
		});
	}
	
	async deleteRenown(messageParts, message)
	{
		this.elevateCommand(message);
		if(this.renowns[message.guild.id])
		{
			for(let membershipNumber of messageParts)
			{
				if(this.renowns[message.guild.id][membershipNumber])
				{
					delete this.renowns[message.guild.id][membershipNumber];
				}
			}
		}
	}
	
	async readRemoteFile(messageParts, message)
	{
		this.elevateCommand(message);
		let URL = messageParts[0].trim();
		this.loadServerRenownFromCSV(message.guild.id, URL).then(()=>{
			message.reply('Renown loaded');
		});
	}
	
	async readLocalFile(messageParts, message)
	{
		this.elevateCommand(message);
		let callbacks = [];
		message.attachments.forEach(async (file)=>{
			callbacks.push(
				this.loadServerRenownFromCSV(message.guild.id, file.url)
			);
		});
		return Promise.all(callbacks).then(()=>{
			message.reply('Renowns loaded');
		});
	}
	
	async register(messageParts, message)
	{
		this.userMap[message.guild.id] = this.userMap[message.guild.id]?this.userMap[message.guild.id]:{};
		this.userMap[message.guild.id][message.author.id] = messageParts[0].trim();
	}
	
	async renownCheck(messageParts, message)
	{
		if(this.renowns[message.guild.id])
		{
			for(let username of messageParts)
			{
				let isMention =username.match(/\<@\!?(\d+)\>/);
				if(isMention)
				{
					let userId = isMention[1],
						memberNumber = this.userMap[message.guild.id]?this.userMap[message.guild.id][userId]:null;
					if(memberNumber)
					{
						let renowns = this.renowns[message.guild.id][memberNumber];
						if (renowns)
						{
							let response = `${username} has `;
							let renownParts = [];
							for(let renown in renowns)
							{
								if(renowns[renown])
								{
									renownParts.push(`${renown}: ${renowns[renown]}`);
								}
							}
							response += renownParts.join(', ');
							message.reply(response);
						}
						else
						{
							message.reply(`I'm sorry. I cannot find a record for that user`);
						}
					}
					else
					{
						message.reply(`That user has not registered their membership number on this server.`);
					}
				}
			}
		}
		else
		{
			message.reply('I have not been configured to run on this server');
		}
	}
}

module.exports = RenownBot;