const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'stocks',
    description: 'Get a list of all available stocks and their values.',
    execute(msg) {
        const stocks = JSON.parse(fs.readFileSync('./data/stocks.json'));
        const embed = new Discord.MessageEmbed()
        .setTitle("Stocks list");
        for(const stock of stocks) {
            embed.addField(`\`${stock.name}\``, `Value: :coin:${stock.value}`); // Reads every stocks and adds it
        }

        msg.channel.send(embed);
    }
}