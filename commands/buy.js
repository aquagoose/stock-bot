const fs = require('fs');
const Discord = require('discord.js');
const jsonWriter = require('../utils/jsonWriter');

module.exports = {
    name: 'buy',
    description: 'Buy shares of a stock. If no amount is supplied, you will buy 1 share.',
    args: true,
    usage: '<stock name> [amount]',
    execute(msg, args) {
        const stockName = args[0].toLowerCase(); // Get the stock name
        if(args[1]) var amount = parseFloat(args[1]); // Convert the amount to an integer
        else amount = 1; // If no amount is supplied, set it to 1.
        if(isNaN(amount)) return msg.channel.send(`Amount must be a number!`); // If passing to the integer failed, send this.
        if(amount == Infinity || amount < 1) return msg.channel.send(`You have provided an invalid amount. You cannot buy less than one, or more than ${Number.MAX_SAFE_INTEGER} shares.`)
        var members = JSON.parse(fs.readFileSync('./data/members.json')); // Read the member data.
        var stock = jsonWriter.getStockWithName(stockName); // Find the stock the member is looking for
        if(!stock) return msg.channel.send(`That stock does not exist!`); // If it doesn't exist...
        if(!members[msg.member.id]) return msg.channel.send(`You need ${msg.coinemoji}${stock.value * amount}${((stock.value * amount > 1 || stock.value * amount < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname} more to purchase "${stock.name}(x${amount})".`); // This gets sent of the member cannot be found in the database.
        if(members[msg.member.id]['balance'] - stock.value * amount < 0) return msg.channel.send(`You need ${msg.coinemoji}${stock.value * amount - members[msg.member.id]['balance']}${((stock.value * amount > 1 || stock.value * amount < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname} more to purchase "${stock.name}(x${amount})".`); // This checks to make sure they have enough money to purchase it.
        members[msg.member.id]['balance'] -= stock.value * amount; // Subtracts the stock's value multipled by the amount from the user's balance.
        var memberFound = false; // Simple check.
        for(const user of stock.users) {
            if(user.id == msg.member.id) {
                memberFound = true;
                user.amount += amount; // If the user buys 5 shares of the stock when they already have 3 shares, add them together.
                break;
            }
        }
        if(!memberFound) stock.users.push({"id":msg.member.id,"amount":amount}); // If the user is not found, add the user to the users list.
        jsonWriter.updateStock(stockName, stock); // Update the stock. I love these tools, was worrying about how I was gonna make this work, until I remembered this function.
        fs.writeFileSync('./data/members.json', JSON.stringify(members)); // Update the members.
        msg.channel.send(`You have purchased "${stockName}(x${amount})" for ${msg.coinemoji}${stock.value * amount}${((stock.value * amount > 1 || stock.value * amount < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname}`);
    }
}