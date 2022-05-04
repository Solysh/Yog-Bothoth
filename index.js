// Require dotenv
require('dotenv').config();

// Require node:fs, Node's native file system
const fs = require('node:fs');

// Require the neccesary discord.js classes
const { Client, Collection, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
	partials: ['GUILD_MEMBER'],
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Testing message creation
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (!message.guild) return;
	if (message.channel.id === '928175164896718909') {
		const messages = ['Hey there', 'Hello', 'Greetings', 'Welcome'];
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];
		client.channels.cache.get('928175164896718909').send(randomMessage + ', ' + message.author.toString() +
			'! Please be sure to read the Welcome FAQ over at <#722901843105153095> and let us know if you have any questions!');
	}
});

// Detect new Message in #player-introductions
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.member.roles.cache.some(r => r.name === 'Initiate')) return;
	if (message.channel.id === '722903689790095421') {
		if (message.content.includes(' ')) {
			await message.guild.roles.fetch();
			const requiredRole = message.guild.roles.cache.find(r => r.name === 'Initiate');
			const desiredRole = message.guild.roles.cache.find(r => r.name === 'Verified');
			const extraSystems = message.guild.roles.cache.find(r => r.id === '762528156040953856');
			const extraCurrentGames = message.guild.roles.cache.find(r => r.id === '762519220726399046');

			message.member.roles.add(desiredRole);
			message.member.roles.add(extraSystems);
			message.member.roles.add(extraCurrentGames);
			message.member.roles.remove(requiredRole);

			const messages = ['Hey there', 'Hello', 'Greetings', 'Welcome'];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			client.channels.cache.get('722903613328064542').send(randomMessage + ', ' + message.author.toString() +
			'! Please be sure to read the Welcome FAQ over at <#722901843105153095> and let us know if you have any questions!');
			return message.reply({ content: 'Nice to meet you!' });
		}
	}
});

// Remove old introductions of members who have left the server
// client.on('guildMemberRemove', async member => {
//    member.guild.channels.cache.forEach(channel => {
//        const fetched = await channel.messages.fetch({limit: 100});
//        const filtered = fetched.filter(m => m.author.id === member.user.id);
//        await message.channel.bulkDelete(filtered);
//    });
// });

// Remove introductions when members leave the server

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);