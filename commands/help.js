const Discord = require("discord.js");
const fs = require("fs");
const yaml = require('js-yaml');

let Config = null;

try {
    let fileContents = fs.readFileSync('./config.yml', 'utf8');
    Config = yaml.load(fileContents);
}
catch (e) {
    console.log(e);
}

module.exports.run = async(bot, message, args) => {
    let embed = new Discord.MessageEmbed()
            .setColor(0xd6d258)
            .setTitle("Gold Bot Commands")
            .addField(`${Config.Setup.Prefix}ping`, "Make sure im still alive.")
            .addField(`${Config.Setup.Prefix}help`, "See this message.")
            .addField(`${Config.Setup.Prefix}submitscore \`(number) [@User]\``, "Submit your score to be saved and tallied.\n```Can only be done twice per user before scores are cleared by an admin.\n\nAdmins can also mention a user to modify their scores.```")
            .addField(`${Config.Setup.Prefix}score`, "See a list of all players scores sorted from low to high.")
            .addField(`${Config.Setup.Prefix}clearscores \`(all|@User)\``, "Clears all the scores, or the scores of a specific person\n```Can only be ran by people with Manage Messages permission```")
            .setFooter('Made by LostAndDead#0001', 'https://cdn.discordapp.com/avatars/329353232570908682/a_dd8b8ac06a7732882f328dfa931a0a62.gif?size=256');
            
        message.channel.send(embed)
};

module.exports.help = {
    name: "help"
};
