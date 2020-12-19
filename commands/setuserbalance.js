const fs = require('fs');
const Discord = require('discord.js');
const jsonWriter = require('../utils/jsonWriter');

module.exports = {
    name: 'setuserbalance',
    description: 'Set the balance of a user.',
    args: true,
    usage: '<user> <balance>',
    admin: true,
    execute(msg, args) {
        var user;
        if(msg.mentions.members.first()) user = msg.mentions.members.first(); // First checks for a mentioned user
        else if(msg.guild.members.cache.find(m => m.displayName === args[0])) user = msg.guild.members.cache.find(m => m.displayName === args[0]); // Next checks for a display name match
        else if(msg.guild.members.cache.find(m => m.id === args[0])) user = msg.guild.members.cache.find(m => m.id === args[0]); // Finally checks for an ID match.
        else return msg.channel.send("I can't find that user."); // If no math, return this.
        var balance = parseFloat(args[1]);
        if(isNaN(balance)) return msg.channel.send(`Balance must be a number!`);
        if(balance == Infinity || balance < 0) return msg.channel.send(`You have provided an invalid balance. You cannot set a balance to less than 0, or more than ${Number.MAX_SAFE_INTEGER}.`)
        var members = JSON.parse(fs.readFileSync('./data/members.json'));
        if(!members[user.id]) members[user.id] = {}; // If the member doesn't exist, create them.
        members[user.id]['balance'] = balance; // Set their balance to be the given balance.
        fs.writeFileSync('./data/members.json', JSON.stringify(members));
        msg.channel.send(`${user.displayName}'s balance has been set to ${msg.coinemoji}${balance}${((balance > 1 || balance < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname}`); // These stupid long lines are annoying but I prioritize memory saving & efficiency over readability.
    }
}