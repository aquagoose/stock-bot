const jsonWriter = require("../utils/jsonWriter");

module.exports = {
    name: 'setstockvalue',
    description: 'Set the value of a stock with name',
    args: true,
    usage: '<stock name> <value>',
    admin: true,
    execute(msg, args) {
        const stockName = args[0].toLowerCase();
        const value = parseFloat(args[1]);
        var stockData = jsonWriter.getStockWithName(stockName);
        if(!stockData) return msg.channel.send(`The stock "${stockName}" does not exist!`);
        if(isNaN(value)) return msg.channel.send(`Value must be a number!`);
        if(value == Infinity || value < 0) return msg.channel.send(`You have provided an invalid value. You cannot set the value to less than 0, or more than ${Number.MAX_SAFE_INTEGER} shares.`)
        stockData.value = value;
        jsonWriter.updateStock(stockName, stockData);
        msg.channel.send(`Stock "${stockName}" has had it's value changed to ${msg.coinemoji}${value}${((value > 1 || value < 1) && msg.currencyname != "") ? `${msg.currencyname}s`: msg.currencyname}`);
    }
}