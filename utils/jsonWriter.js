const { exception } = require('console');
const fs = require('fs');

module.exports = {
    getStockWithName(name) {
        const stocks = JSON.parse(fs.readFileSync('./data/stocks.json'));
        for (const stock of stocks) {
            if(stock.name == name) return stock;
        }
        return null;
    },

    createStock(name, value) {
        var stocks = JSON.parse(fs.readFileSync('./data/stocks.json'));
        if(this.getStockWithName(name)) throw "Stock already exists!";
        const stockStructure = {
            name: name,
            value: value,
            users: []
        }
        stocks.push(stockStructure);
        fs.writeFileSync('./data/stocks.json', JSON.stringify(stocks));
    },

    updateStock(name, stockData) {
        if(!this.getStockWithName(name)) throw `Stock "${name}" does not exist.`;
        const stocks = JSON.parse(fs.readFileSync('./data/stocks.json'));
        for(var i=0;i<stocks.length;i++) {
            if(stocks[i].name == name) {
                stocks[i] = stockData;
            }
        }
        fs.writeFileSync('./data/stocks.json', JSON.stringify(stocks));
    }
}