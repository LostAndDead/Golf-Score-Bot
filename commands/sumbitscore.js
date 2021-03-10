const Discord = require("discord.js");
const fs = require('fs');
const yaml = require('js-yaml');

let Config = null;
let messages = null;

try {
    let fileContents = fs.readFileSync('./config.yml', 'utf8');
    Config = yaml.load(fileContents);
}
catch (e) {
    console.log(e);
}

try {
    let fileContents = fs.readFileSync('./messages.yml', 'utf8');
    messages = yaml.load(fileContents);
    console.log(messages)
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
        userID = args[1].replace("!","")
        userID = userID.replace("<","")
        userID = userID.replace(">","")
        userID = userID.replace("@","")
        userID = userID.replace("&","")
        console.log(userID)
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

    let joke = null
    if (Math.abs(score) == 69){
        joke = messages["= ±69"][Math.floor(Math.random() * messages["= ±69"].length)]
    }else if(score <= -25){
        joke = messages["<= -25"][Math.floor(Math.random() * messages["<= -25"].length)]
    }else if(score <= -22){
        joke = messages["<= -22"][Math.floor(Math.random() * messages["<= -22"].length)]
    }else if(score <= -18){
        joke = messages["<= -18"][Math.floor(Math.random() * messages["<= -18"].length)]
    }else if(score <= -12){
        joke = messages["<= -12"][Math.floor(Math.random() * messages["<= -12"].length)]
    }else if(score <= -6){
        joke = messages["<= -6"][Math.floor(Math.random() * messages["<= -6"].length)]
    }else if(score <= -1){
        joke = messages["<= -1"][Math.floor(Math.random() * messages["<= -1"].length)]
    }else if(score == 0){
        joke = messages["= 0"][Math.floor(Math.random() * messages["= 0"].length)]
    }else if(score <= 5){
        joke = messages["<= 5"][Math.floor(Math.random() * messages["<= 5"].length)]
    }else if(score <= 10){
        joke = messages["<= 10"][Math.floor(Math.random() * messages["<= 10"].length)]
    }else{
        joke = messages["Else"][Math.floor(Math.random() * messages["Else"].length)]
    }


    if (other){
        try{
            let user = await bot.users.fetch(userID)
            console.log(`${message.author.tag} submitted a new score for ${user.tag} of ${score} making there new score ${data[userID]}`)
            let embed = new Discord.MessageEmbed()
                .setColor(0x23c449)
                .addField(joke, `Successfully updated ${user.tag}'s score's`);
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
            .addField(joke, "Successfully updated your score");
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
