// Require dotenv
require('dotenv').config();

// Require the neccesary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MEMBERS,
    ],
    partials: ["GUILD_MEMBER"]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Detect new Message in #player-introductions
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.member.roles.cache.some(r => r.name === 'Initiate')) return;        
    if (message.channel.id === '722903689790095421') {
        if (message.content.includes(" ")) {
            await message.guild.roles.fetch()
            let requiredRole = message.guild.roles.cache.find(r => r.name === 'Initiate')
            let desiredRole = message.guild.roles.cache.find(r => r.name === 'Verified')
            let extraSystems = message.guild.roles.cache.find(r => r.id === '762528156040953856')
            let extraCurrentGames = message.guild.roles.cache.find(r => r.id === '762519220726399046')     

            message.member.roles.add(desiredRole)
            message.member.roles.add(extraSystems)
            message.member.roles.add(extraCurrentGames)
            message.member.roles.remove(requiredRole)
            //client.channels.cache.get('722903613328064542').send('Hello there!');
            return message.reply({ content: "Nice to meet you!" });
        }
    }
});

// Remove old introductions of members who have left the server
//client.on('guildMemberRemove', async member => {
//    member.guild.channels.cache.forEach(channel => {
//        const fetched = await channel.messages.fetch({limit: 100});
//        const filtered = fetched.filter(m => m.author.id === member.user.id);
//        await message.channel.bulkDelete(filtered);
//    });
//});

// Remove introductions when members leave the server

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);