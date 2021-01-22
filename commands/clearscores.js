const Discord = require("discord.js");
const fs = require('fs');
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
    if (message.member.hasPermission("MANAGE_MESSAGES") || message.author.id == Config.Settings.OwnerID){
        let rawdata = fs.readFileSync('data.json');
        let data = JSON.parse(rawdata);

        rawdata = fs.readFileSync('scores.json');
        let scoresData = JSON.parse(rawdata);

        if(args[0] == "all"){
            data = {}
            scoresData = {}
            console.log(`${message.author.tag} cleared all the scores`)

            let embed = new Discord.MessageEmbed()
                .setColor(0xfffff)
                .setTitle("Successfully cleared all scores");
            message.channel.send(embed)
        }else if(args[0] && (args[0].startsWith("<@") && args[0].endsWith(">"))){
            let userID = args[0].slice(3, -1)
            let user = await bot.users.fetch(userID)
            delete data[userID]
            delete scoresData[userID]

            console.log(`${message.author.tag} cleared ${user.tag}'s scores`)

            let embed = new Discord.MessageEmbed()
                .setColor(0xfffff)
                .setTitle(`Successfully cleared ${user.tag}'s scores`);
            message.channel.send(embed)
        }else{
            let embed = new Discord.MessageEmbed()
                .setColor(0xd63344)
                .setTitle(`Thats not a valid argument, please see the help command.`);
            message.channel.send(embed)
        }

        let writedata = JSON.stringify(scoresData);
        fs.writeFileSync('scores.json', writedata);

        writedata = JSON.stringify(data);
        fs.writeFileSync('data.json', writedata);

        
    }
};

module.exports.help = {
    name: "clearscores"
};
