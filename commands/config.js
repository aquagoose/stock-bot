const fs = require('fs');
const Discord = require('discord.js');
const jsonWriter = require('../utils/jsonWriter');
const { defaultprefix } = require('../config.json');

module.exports = {
    name: 'config',
    description: 'Configure stock bot. Type \`$config help\` to get a list of commands.',
    admin: true,
    args: true,
    usage: '<option> [option arguments]',
    execute(msg, args) {
        var serverData = JSON.parse(fs.readFileSync('./data/server-data.json'));
        const option = args[0].toLowerCase();
        switch(option) {
            case 'help':
                const embed = {
                    title: `${msg.client.user.username} - ${this.name} help`,
                    fields: [
                        {
                            name: `\`${msg.guild.prefix}${this.name} currencyname <currency name>\``,
                            value: `Set the currency name. Alternatively, type \`default\` to return to default. Default is disabled.`
                        },
                        {
                            name: `\`${msg.guild.prefix}${this.name} coinemoji <coin emoji>\``,
                            value: `Set the coin emoji. Alternatively, type \`default\` to return to default. Default is :coin:\nYou can also type \`disable\` to prevent an emoji from appearing.`
                        },
                        {
                            name: `\`${msg.guild.prefix}${this.name} prefix <prefix>\``,
                            value: `Set the bot prefix. Alternatively, type \`default\` to return to default. Default is ${defaultprefix}`
                        },
                        {
                            name: `\`${msg.guild.prefix}${this.name} adminrole <role ID>\``,
                            value: `Set the admin role for the bot. This grants access to admin commands. By default, any member with the "ADMINISTRATOR" permission can use admin commands. **Please provide a role __ID__, do not mention the role.**\nType \`delete\` instead of a role ID to remove the admin role.`
                        },
                    ]
                };
                msg.channel.send({embed: embed});
                break;
            case 'currencyname':
                if(!args[1]) return msg.channel.send(`Please provide a currency name. Alternatively, type \`default\` to return to default.`);
                const getArgs = args.splice(1, args.length).join(" ");
                if(getArgs.toLowerCase() == "default") delete serverData['currencyname'];
                else serverData['currencyname'] = ` ${getArgs}`;
                fs.writeFileSync('./data/server-data.json', JSON.stringify(serverData));
                msg.channel.send(`Currency name has been ${(getArgs.toLowerCase() == "default") ? "reset to default." : `changed to \`${getArgs}\``}`);
                break;
            case 'coinemoji':
                if(!args[1]) return msg.channel.send(`Please provide a coin emoji. Alternatively, type \`default\` to return to default, or \`disable\` to disable the emoji.`);
                if(args[1].toLowerCase() == "default") serverData['coinemoji'] = ":coin:";
                else if(args[1].toLowerCase() == "disable") serverData['coinemoji'] = "NULL";
                else serverData['coinemoji'] = args[1];
                fs.writeFileSync('./data/server-data.json', JSON.stringify(serverData));
                msg.channel.send(`Coin emoji has been ${(args[1].toLowerCase() == "default") ? "reset to default." : (args[1].toLowerCase() == "disable") ? `disabled.` : `changed to ${args[1]}`}`);
                break;
            case 'prefix':
                if(!args[1]) return msg.channel.send(`Please provide a prefix. Alternative, type \`default\` to return to default.`);
                if(args[1].toLowerCase() == "default") delete serverData['prefix'];
                else serverData['prefix'] = args[1].toLowerCase();
                fs.writeFileSync('./data/server-data.json', JSON.stringify(serverData));
                msg.channel.send(`The prefix has been ${(args[1].toLowerCase() == "default") ? "reset to default" : `changed to \`${args[1].toLowerCase()}\``}.`);
                break;
            case 'adminrole':
                if(!args[1]) return msg.channel.send(`Please provide a prefix. Alternative, type \`delete\` to remove the admin role.`);
                if(args[1].toLowerCase() == "delete") delete serverData['adminrole'];
                else serverData['adminrole'] = args[1].toLowerCase();
                fs.writeFileSync('./data/server-data.json', JSON.stringify(serverData));
                msg.channel.send(`Admin role has been ${(args[1].toLowerCase() == "delete") ? "removed." : `set to \`${args[1].toLowerCase()}\``}.`);
                break;
            default:
                msg.channel.send(`That's not an option! Type \`${msg.guild.prefix}${this.name} help\` to get a list of commands.`);
        }
    }
}