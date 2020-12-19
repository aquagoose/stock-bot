const fs = require('fs');
const Discord = require('discord.js');
const jsonWriter = require('../utils/jsonWriter');

module.exports = {
    name: 'sell',
    description: 'Sell a chosen amount of shares of the chosen stock. If no amount is supplied, you will sell 1 share.',
    args: true,
    usage: '<stock name> [amount]',
    execute(msg, args) {
        const stockName = args[0].toLowerCase();
        if(args[1]) var amount = parseInt(args[1]); // Check for the amount the user has provided
        else var amount = 1; // If no amount then default to 1.
        if(isNaN(amount)) return msg.channel.send(`Amount must be a number!`);
        if(amount == Infinity || amount < 1) return msg.channel.send(`You have provided an invalid amount. You cannot sell less than 1, or more than ${Number.MAX_SAFE_INTEGER} shares.`)
        var members = JSON.parse(fs.readFileSync('./data/members.json')); // Read the member data.
        var stock = jsonWriter.getStockWithName(stockName); // Get the stock
        if(!stock) return msg.channel.send(`That stock does not exist!`);
        for (const user of stock.users) { // Runs through a list of stocks
            if(user.id == msg.member.id) { // Runs through a list of members in each stock
                if(user.amount - amount < 0) return msg.channel.send(`You do not have ${amount} shares. You can only sell a max of ${user.amount} shares.`);
                members[msg.member.id]['balance'] += stock.value * amount; // Adds the correct coins to their balance
                user.amount -= amount; // Removes the amount of shares from their current shares
                if(user.amount == 0) stock.users.splice(stock.users.indexOf(user), 1); // If the shares are 0, remove them from the list.
                jsonWriter.updateStock(stockName, stock); // Write the stock data
                fs.writeFileSync('./data/members.json', JSON.stringify(members)); // Write the member data.
                return msg.channel.send(`You sold "${stockName}(x${amount})" and recieved ${msg.coinemoji}${stock.value * amount}${((stock.value * amount > 1 || stock.value * amount < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname}`);
            }
        }
        msg.channel.send(`You have no shares in "${stockName}".`); // Since the success message is returned, this will only run if the user cannot be found in any stocks.
    }
}