const fs = require('fs');
const Discord = require('discord.js');
const jsonWriter = require('../utils/jsonWriter');

module.exports = {
    name: 'givestock',
    description: 'Give the chosen user an optional amount of shares in a stock.',
    args: true,
    usage: '<user> <stock name> [amount]',
    admin: true,
    execute(msg, args) {
        var user;
        if(msg.mentions.members.first()) user = msg.mentions.members.first(); // First checks for a mentioned user
        else if(msg.guild.members.cache.find(m => m.displayName === args[0])) user = msg.guild.members.cache.find(m => m.displayName === args[0]); // Next checks for a display name match
        else if(msg.guild.members.cache.find(m => m.id === args[0])) user = msg.guild.members.cache.find(m => m.id === args[0]); // Finally checks for an ID match.
        else return msg.channel.send("I can't find that user."); // If no math, return this.
        const stockName = args[1].toLowerCase(); // Get the stock name
        if(args[2]) var amount = parseInt(args[2]); // Convert the amount to an integer
        else amount = 1; // If no amount is supplied, set it to 1.
        if(isNaN(amount)) return msg.channel.send(`Amount must be a number!`); // If passing to the integer failed, send this.
        if(amount == Infinity || amount < 1) return msg.channel.send(`You have provided an invalid amount. You cannot give less than 1, or more than ${Number.MAX_SAFE_INTEGER} shares.`)
        var stock = jsonWriter.getStockWithName(stockName); // Find the stock the member is looking for
        if(!stock) return msg.channel.send(`That stock does not exist!`); // If it doesn't exist...
        var memberFound = false; // Simple check.
        for(const users of stock.users) {
            if(users.id == user.id) {
                memberFound = true;
                users.amount += amount; // If the user buys 5 shares of the stock when they already have 3 shares, add them together.
                break;
            }
        }
        if(!memberFound) stock.users.push({"id":user.id,"amount":amount}); // If the user is not found, add the user to the users list.
        jsonWriter.updateStock(stockName, stock); // Update the stock. I love these tools, was worrying about how I was gonna make this work, until I remembered this function.
        msg.channel.send(`You gave ${user.displayName} "${stockName}(x${amount})"`);
    }
}