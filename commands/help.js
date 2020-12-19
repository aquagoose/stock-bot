const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'If you can see this, it probably means the bot may have an issue somewhere, as you shouldn\'t be able to see it.',
    execute(msg) {
        const cmds = msg.client.commands.map(cmd => cmd); // Map the list of commands.
        const embed = new Discord.MessageEmbed()
        .setTitle(`${msg.client.user.username} - Help`)
        .setFooter('<> brackets are required arguments, [] brackets are optional arguments');
        for(const command of cmds) {
            var usage = "";
            if(command.usage) usage = ` ${command.usage}`;
            if(command.name != this.name && ((command.admin) ? ((msg.member.isAdmin) ? true : false) : true)) embed.addField(`\`${msg.guild.prefix}${command.name}${usage}\`${(command.admin) ? " **- ADMIN ONLY!**" : ""}`, command.description);
        }
        msg.channel.send(embed);
    }
}