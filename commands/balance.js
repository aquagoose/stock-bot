const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'balance',
    description: 'Get the amount of coins you have, along with each stock and number of shares you have invested in.',
    usage: '[member]',
    execute(msg, args) {
        var getUser = msg.member;
        if(args[0]) {
            if(msg.mentions.members.first()) getUser = msg.mentions.members.first(); // First checks for a mentioned user
            else if(msg.guild.members.cache.find(m => m.displayName === args[0])) getUser = msg.guild.members.cache.find(m => m.displayName === args[0]); // Next checks for a display name match
            else if(msg.guild.members.cache.find(m => m.id === args[0])) getUser = msg.guild.members.cache.find(m => m.id === args[0]); // Finally checks for an ID match.
            else return msg.channel.send("I can't find that user."); // If no math, return this.
        }
        const members = JSON.parse(fs.readFileSync('./data/members.json')); // Get the members list.
        const stocks = JSON.parse(fs.readFileSync('./data/stocks.json')); // Get the stocks list.
        const getMember = members[getUser.id]; // Find the member
        var balance = 0; // Default balance is 0, this is to prevent errors.
        if(getMember) balance = getMember.balance; // If the member exists, return their balance.
        const embed = new Discord.MessageEmbed()
        .setAuthor(getUser.displayName, getUser.user.displayAvatarURL())
        .setTitle('Account Balance')
        .addField(`Balance`, `${msg.coinemoji}${balance}${((balance > 1 || balance < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname}`, true); // This ? operator is the simplest of all, just simply works out if it should use a plural, depending on if a currency name has been set.
        var shareString = ""; // A string that will hold all shares
        for(const stock of stocks) {
            for(const user of stock.users) {
                if(user.id == getUser.id) shareString += `${stock.name} - ${user.amount} share${(user.amount == 1) ? "" : "s"}\n`; // Runs through all the stocks, and all members in each stock, and looks for the specific member ID.
            }
        }
        if(!shareString.length) shareString = `You have no shares in any stocks.`; // If the length is 0, make the share string this.
        embed.addField(`Stocks`, shareString, true);
        msg.channel.send(embed);
    }
}