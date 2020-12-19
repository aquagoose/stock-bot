// Ollie Robinson 2020
const Discord = require('discord.js'); // Import discord
const fs = require('fs'); // Import FS
const client = new Discord.Client(); // Create a client
client.commands = new Discord.Collection(); // Set the client commands as a collection
const { defaultprefix, token, iftttkey, iftttname } = require('./config.json'); // Import data from the config file (this file is hidden as it contains private information)
var presenceNumber = 0; // Used for the rolling presence
const IFTTT = require('ifttt-webhooks-channel');
const ifttt = new IFTTT(iftttkey);

var presenceList = [[`${defaultprefix}help`,'PLAYING']]; // Allows for custom presences & easy adjusting

const getCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Get a list of JavaScript files from the commands folder.

for (const command of getCommands) { // This sets every command.
    console.log(`Loading ${command}`); 
    const cmd = require(`./commands/${command}`); // Includes the command
    client.commands.set(cmd.name, cmd); // Sets the command.
    console.log(`Loaded ${cmd.name}`);
}

process.on('uncaughtException', async (err) => { // These are exception handlers
    const date = new Date(); // Get the date
    fs.appendFileSync('./logs.txt', `UNCAUGHT EXCEPTION (${date.toLocaleString()}):\n${err.stack}\n\n`); // Append the log to the log file
    console.error(err); // Log the error
    await ifttt.post(iftttname, [client.user.username, 'UNCAUGHT EXCEPTION', err.stack]) // Send the error to a notification
    process.exit(); // Exit the program.
});

process.on('unhandledRejection', async (err) => { // Works the same as above.
    const date = new Date();
    fs.appendFileSync('./logs.txt', `UNHANDLED REJECTION (${date.toLocaleString()}):\n${err.stack}\n\n`);
    console.error(err);
    await ifttt.post(iftttname, [client.user.username, 'UNHANDLED REJECTION', err.stack])
});

client.on('ready', () => { // Runs when the bot is ready.
    console.log("Bot is ready!");
    setInterval(function() {
        presenceNumber++;
        if(presenceNumber > presenceList.length-1) presenceNumber = 0;
        client.user.setActivity(presenceList[presenceNumber][0], {type: presenceList[presenceNumber][1]}); // Set the bot presence.
    }, 30000);
});

client.on('message', msg => {
    if(msg.guild == null) return; // Does not run if in DM.
    msg.guild.prefix = JSON.parse(fs.readFileSync('./data/server-data.json')).prefix; // Get the prefix data from the server-data.json
    if(!msg.guild.prefix) msg.guild.prefix = defaultprefix; // If it doesn't exist, set the prefix to default.
    if(!msg.content.startsWith(msg.guild.prefix) || msg.author.bot) return; // Ignores bots & messages that don't start with the prefix.

    const args = msg.content.slice(msg.guild.prefix.length).split(" "); // Gets the arguments
    if(args[0] == '') args.shift();
    const commandName = args.shift().toLowerCase(); // Shifts the first argument to get the command name
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // Find the command.

    if(!command) return msg.channel.send("That's not a command!");

    const serverData = JSON.parse((fs.readFileSync('./data/server-data.json'))); // Sets various pieces of data, so it does not need to be read every time.
    if(!serverData['coinemoji']) msg.coinemoji = ':coin:';
    else if(serverData['coinemoji'] == "NULL") msg.coinemoji = "";
    else msg.coinemoji = serverData['coinemoji'];
    if(serverData['currencyname']) msg.currencyname = serverData['currencyname'];
    else msg.currencyname = "";

    if(msg.member.hasPermission('ADMINISTRATOR') || msg.member.roles.cache.has(serverData['adminrole'])) msg.member.isAdmin = true;
    else msg.member.isAdmin = false;

    if(command.admin && !msg.member.isAdmin) return msg.channel.send("Only an admin can use that command!");

    if(command.args && !args.length) return msg.channel.send(`That command requires some arguments!`);

    try {
        command.execute(msg, args);
    } catch(err) {
        const date = new Date();
        fs.appendFileSync('./logs.txt', `CAUGHT EXCEPTION (${date.toLocaleString()}):\n${err.stack}\n\n`);
        console.error(err);
        msg.channel.send(`Whoops, an error occured. Please contact <@276384253166747649> about this, with the following error:\n\`${err}\``);
        ifttt.post(iftttname, [client.user.username, 'CAUGHT EXCEPTION', err.stack])
    }
});

client.login(token);