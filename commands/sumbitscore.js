const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async(bot, message, args) => {
    let rawdata = fs.readFileSync('data.json');
    let data = JSON.parse(rawdata);  

    let userID = message.author.id
    let score = args[0]
    let parsed = parseInt(args[0])
    if(isNaN(parsed)){
        let embed = new Discord.MessageEmbed()
            .setColor(0xd63344)
            .setTitle("Thats not a number, not sure what you expect me to do?");
        return message.channel.send(embed)
    }

    if(!data[userID]){
        data[userID] = parsed
    }else{
        data[userID] += parsed
    }
    let embed = new Discord.MessageEmbed()
        .setColor(0x23c449)
        .setTitle("Successfully updated your score");
    message.channel.send(embed)

    let writedata = JSON.stringify(data);
    fs.writeFileSync('data.json', writedata);
};

module.exports.help = {
    name: "submitscore"
};
