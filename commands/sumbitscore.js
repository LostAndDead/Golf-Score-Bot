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
    let rawdata = fs.readFileSync('data.json');
    let data = JSON.parse(rawdata); 
    
    rawdata = fs.readFileSync('scores.json');
    let scoresData = JSON.parse(rawdata);

    let userID = message.author.id
    let other = false

    if(args[1] && (message.member.hasPermission("MANAGE_MESSAGES") || message.author.id == Config.Settings.OwnerID) && (args[1].startsWith("<@") && args[1].endsWith(">"))){
        args[1] = args[1].slice(3, -1)
        userID = args[1]
        other = true
    }

    if (args[0].length > 4){
        let embed = new Discord.MessageEmbed()
            .setColor(0xd63344)
            .setTitle("Stop trying to break me.");
        return message.channel.send(embed)
    }
    let score = args[0]
    let parsed = parseInt(args[0])
    if(isNaN(parsed)){
        let embed = new Discord.MessageEmbed()
            .setColor(0xd63344)
            .setTitle("Thats not a number, not sure what you expect me to do?");
        return message.channel.send(embed)
    }

    if(!scoresData[userID]){
        scoresData[userID] = [score]
    }else if(scoresData[userID].length == 1){
        scoresData[userID].push(score)
    }else{
        let embed = new Discord.MessageEmbed()
            .setColor(0xd63344)
            .setTitle("You have already submitted 2 scores");
        return message.channel.send(embed)
    }

    if(!data[userID]){
        data[userID] = parsed
    }else{
        data[userID] += parsed
    }

    if (other){
        try{
            let user = await bot.users.fetch(userID)
            console.log(`${message.author.tag} submitted a new score for ${user.tag} of ${score} making there new score ${data[userID]}`)
            let embed = new Discord.MessageEmbed()
                .setColor(0x23c449)
                .setTitle(`Successfully updated ${user.tag}'s score'`);
            message.channel.send(embed)
        }catch (err){
            let embed = new Discord.MessageEmbed()
                .setColor(0xd63344)
                .setTitle("Something went wrong, make sure you mentioned a valid user.");
            return message.channel.send(embed)
        }
        
        
    }else{
        console.log(`${message.author.tag} submitted a new score of ${score} making there new score ${data[userID]}`)
        let embed = new Discord.MessageEmbed()
            .setColor(0x23c449)
            .setTitle("Successfully updated your score");
        message.channel.send(embed)
    }
    

    let writedata = JSON.stringify(scoresData);
    fs.writeFileSync('scores.json', writedata);

    writedata = JSON.stringify(data);
    fs.writeFileSync('data.json', writedata);
};

module.exports.help = {
    name: "submitscore"
};
