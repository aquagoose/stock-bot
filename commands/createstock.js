const fs = require('fs');
const jsonWriter = require('../utils/jsonWriter');

module.exports = {
    name: 'createstock',
    description: 'Create a stock with chosen name and optional value. Default value is 1.',
    args: true,
    usage: '<stock name> [value]',
    admin: true,
    execute(msg, args) {
        const stockName = args[0].toLowerCase(); // Stock names are lower case and one word.
        var stockValue = parseFloat(args[1]); // The optional value.
        if(isNaN(stockValue)) stockValue = 1; // If it doesn't exist or is not a number, set it to 1.
        if(stockValue == Infinity || stockValue < 0) return msg.channel.send(`You have provided an invalid value. You cannot set the value to less than 0, or more than ${Number.MAX_SAFE_INTEGER}.`)
        if(jsonWriter.getStockWithName(stockName)) return msg.channel.send(`The stock "${stockName}" already exists!`); // Check to see if the stock already exists.
        jsonWriter.createStock(stockName, stockValue); // Otherwise, create the stock.
        msg.channel.send(`Stock "${stockName}" created!`);
    }
}