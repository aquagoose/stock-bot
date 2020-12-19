const fs = require('fs');
const Discord = require('discord.js');
const jsonWriter = require('../utils/jsonWriter');

module.exports = {
    name: 'deletestock',
    description: 'Delete a stock and refund investors. Type `-norefund` after the stock name to **not** refund investors.',
    admin: true,
    args: true,
    usage: '<stock name> [no refund?]',
    execute(msg, args) {
        const stockName = args[0].toLowerCase(); // Get the stock name
        if(!jsonWriter.getStockWithName(stockName)) return msg.channel.send(`The stock "${stockName}" does not exist!`); // Checks to see if the stock exists.
        var stocks = JSON.parse(fs.readFileSync('./data/stocks.json'));
        var members = JSON.parse(fs.readFileSync('./data/members.json'));
        if(args[1] == '-norefund') var refund = false; // Checks to see if the second argument is -norefund
        else var refund = true;
        if(!refund) {
            for (var i=0;i<stocks.length;i++) {
                if(stocks[i].name == stockName) { // This just deletes the stock
                    stocks.splice(i, 1); // Split the stock out of the list, effectively removing it.
                    fs.writeFileSync('./data/stocks.json', JSON.stringify(stocks));
                    return msg.channel.send(`Stock "${stockName}" deleted.`);
                }
            }
        }
        else {
            for (var i=0;i<stocks.length;i++) {
                if(stocks[i].name == stockName) {
                    for(const user of stocks[i].users) { // This one runs through a list of users, and adds the value of the stock multiplied by the amount they have onto their balance.
                        members[user.id]['balance'] += (stocks[i].value * user.amount);
                    }
                    stocks.splice(i, 1);
                    fs.writeFileSync('./data/stocks.json', JSON.stringify(stocks));
                    fs.writeFileSync('./data/members.json', JSON.stringify(members));
                    return msg.channel.send(`Stock "${stockName}" deleted.`);
                }
            }
        }
    }
}