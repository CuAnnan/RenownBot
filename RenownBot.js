const DiscordBot = require('./DiscordBot.js');
const request = require('request-promise-native');

class RenownBot extends DiscordBot
{
	constructor()
	{
		super();
		this.fileLocations = {};
		this.renowns = {};
		this.userMap = {};
	}
	
	attachCommands()
	{
		super.attachCommands();
		this.attachCommand('setFileLocation', this.setFileLocation);
		this.attachCommand('register', this.register);
		this.attachCommand('renownCheck', this.renownCheck);
	}
	
	async hoist(client)
	{
		await super.hoist(client);
		for(let serverId in this.fileLocations)
		{
			await this.loadServerRenownFromCSV(serverId, this.fileLocations[serverId]);
		}
	}
	
	getSettingsToSave()
	{
		let settingsToSave = super.getSettingsToSave();
		settingsToSave.fileLocations = this.fileLocations;
		settingsToSave.userMap = this.userMap;
		return settingsToSave;
	}
	
	async loadServerRenownFromCSV(serverId, csvURL)
	{
		await request.get(csvURL).then((csv)=>{
			this.renowns[serverId] = this.renowns[serverId]?this.renowns[serverId]:{};
			let lines = csv.split('\n');
			// we don't care about the titles
			lines.shift();
			for(let line of lines)
			{
				let [number, cunning, glory, honor, purity, wisdom] =line.trim().split(',');
				this.renowns[serverId][number] = {Cunning:cunning,Glory:glory, Honor:honor, Wisdom:wisdom,Purity:purity};
			}
		}).catch((err)=>{
			console.warn(err);
		});
	}
	
	setFileLocation(messageParts, message)
	{
		this.elevateCommand(message);
		let URL = messageParts[0].trim();
		this.fileLocations[message.guild.id] = URL;
		this.loadServerRenownFromCSV(message.guild.id, URL);
	}
	
	register(messageParts, message)
	{
		this.userMap[message.guild.id] = this.userMap[message.guild.id]?this.userMap[message.guild.id]:{};
		this.userMap[message.guild.id][message.author.id] = messageParts[0].trim();
	}
	
	renownCheck(messageParts, message)
	{
		for(let username of messageParts)
		{
			let isMention =username.match(/\<@\!?(\d+)\>/);
			if(isMention)
			{
				let userId = isMention[1],
					memberNumber = this.userMap[message.guild.id][userId];
				if(this.renowns[message.guild.id])
				{
					if (memberNumber)
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
				else
				{
					message.reply('I have not been configured to run on this server');
				}
			}
		}
	}
}

module.exports = RenownBot;