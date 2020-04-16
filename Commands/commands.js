const Discord = require('discord.js');

const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');

const bot = new Discord.Client();

var prefix = '+';

var stats = {};
if(fs.existsSync('stats.json')) {
    stats = jsonfile.readFileSync('stats.json');
}

bot.on('message', (message) => {
    // checks if bot, so bot cannot get XP 
    if(message.author.id == bot.user.id)
        return;

    // initializes the guild for the first time
    if(message.guild.id in stats === false) {
        stats[message.guild.id] = {};
    }

    // initializes the user for the first time
    const guildStats = stats[message.guild.id];
    if(message.author.id in guildStats === false) {
        guildStats[message.author.id] = {
            xp: 0,
            level: 0,
            last_message: 0
        };
    }

    const userStats = guildStats[message.author.id];

    // Checks if a minute has passed since last message (if so, give XP)
    if(Date.now() - userStats.last_message > 60000) {
        // gives user XP
        userStats.xp += random.int(15, 25);
        userStats.last_message = Date.now();
        
        // checking if user can level up + giving user new level if can
        const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
        if(userStats.xp >= xpToNextLevel) {
            userStats.level++;
            //if(userStats.level >= 4) {

            //}
            userStats.xp =  userStats.xp - xpToNextLevel;
            message.channel.send(message.author.username + ' has reached level ' + userStats.level);
        }

        // recording data in stats.json
        jsonfile.writeFileSync('stats.json', stats);

        // System messages for testing
        console.log(message.author.username + ' now has ' + userStats.xp);
        console.log(xpToNextLevel + ' XP needed for next level.');
    }

    const parts = message.content.split(' ');

    if(parts[0] == prefix + `help`)
        message.reply('hi');

});