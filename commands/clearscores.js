const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async(bot, message, args) => {
    if (message.member.hasPermission("MANAGE_MESSAGES")){
        let rawdata = fs.readFileSync('data.json');
        let data = JSON.parse(rawdata);

        rawdata = fs.readFileSync('scores.json');
        let scoresData = JSON.parse(rawdata);

        data = {}
        scoresData = {}

        let writedata = JSON.stringify(scoresData);
        fs.writeFileSync('scores.json', writedata);

        writedata = JSON.stringify(data);
        fs.writeFileSync('data.json', writedata);

        let embed = new Discord.MessageEmbed()
            .setColor(0x23c449)
            .setTitle("Successfully cleared scores");
        message.channel.send(embed)
    }
};

module.exports.help = {
    name: "clearscores"
};
