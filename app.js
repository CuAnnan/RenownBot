const Discord = require('discord.js');
const client = new Discord.Client();
const conf = require('./conf.js');
const Bot = require('./RenownBot.js');
const bot = new Bot();

client.login(conf.clientToken);
client.once(
	'ready',
	function()
	{
		console.log("Logged in as "+client.user.username+"!");
		
		bot.hoist(client).then(
			()=>{
				console.log('Hoisted bot');
				bot.listen();
			}
		);
	}
);

process.on(
	'SIGINT',
	function()
	{
		console.log('Shutting down bot')
		bot.shutdown();
		console.log('Shutting down client');
		client.destroy();
		console.log('Shutting down app');
		process.exit();
	}
);

process.on('unhandledRejection', console.error);
console.log('Starting');