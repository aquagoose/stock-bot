const fs = require('fs');
const Discord = require('discord.js');
const jsonWriter = require('../utils/jsonWriter');

module.exports = {
    name: 'pay',
    description: 'Pay someone the specified amount of money.',
    args: true,
    usage: '<user> <amount>',
    execute(msg, args) {
        var user;
        if(msg.mentions.members.first()) user = msg.mentions.members.first(); // First checks for a mentioned user
        else if(msg.guild.members.cache.find(m => m.displayName === args[0])) user = msg.guild.members.cache.find(m => m.displayName === args[0]); // Next checks for a display name match
        else if(msg.guild.members.cache.find(m => m.id === args[0])) user = msg.guild.members.cache.find(m => m.id === args[0]); // Finally checks for an ID match.
        else return msg.channel.send("I can't find that user."); // If no math, return this.
        var amount = parseFloat(args[1]);
        if(isNaN(amount)) return msg.channel.send(`Amount must be a number!`);
        if(amount == Infinity || amount < 0) return msg.channel.send(`You have provided an invalid amount. You cannot pay less than 0, or more than ${Number.MAX_SAFE_INTEGER}.`)
        var members = JSON.parse(fs.readFileSync('./data/members.json'));
        if(!members[msg.member.id]) return msg.channel.send(`You cannot pay anyone, as you have no balance!`);
        if(members[msg.member.id]['balance'] == 0) return msg.channel.send(`You cannot pay anyone, as you have no balance!`);
        if(members[msg.member.id]['balance'] - amount < 0) return msg.channel.send(`You don't have enough balance to do that.`);
        if(!members[user.id]) members[user.id] = {"balance":0}; // If the member doesn't exist, create them.
        members[user.id]['balance'] = members[user.id]['balance'] + amount; // Set their balance to be the given balance.
        members[msg.member.id]['balance'] -= amount;
        fs.writeFileSync('./data/members.json', JSON.stringify(members));
        msg.channel.send(`You paid ${user.displayName} ${msg.coinemoji}${amount}${((amount > 1 || amount < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname}`); // These stupid long lines are annoying but I prioritize memory saving & efficiency over readability.
    }
}