const Discord = require("discord.js");
const fs = require('fs');
const { userInfo } = require("os");

module.exports.run = async(bot, message, args) => {
    let rawdata = fs.readFileSync('data.json');
    let data = JSON.parse(rawdata);

    rawdata = fs.readFileSync('scores.json');
    let scoresData = JSON.parse(rawdata);

    var sortable = []
    for (var item in data){
        sortable.push([item, data[item]])
    }
    sortable.sort(function(a,b){
        return a[1] - b[1]
    })

    var objSorted = {}
    sortable.forEach(function(item){
        objSorted[item[0]]=item[1]
    })

    var string
    if(Object.keys(objSorted).length > 0){
        string = ""
    }else{
        string = "No Scores"
    }

    for (let item in objSorted) {
        if(scoresData[item].length == 2){
            string += (`<@${item}> Total Score: \`${objSorted[item]}\`\nRound 1: \`${scoresData[item][0]}\`    Round 2: \`${scoresData[item][1]}\``)
        }else{
            string += (`<@${item}> Total Score: \`${objSorted[item]}\`\nRound 1: \`${scoresData[item][0]}\` Round 2: \`TBD\``)
        }
    }

    let embed = new Discord.MessageEmbed()
        .setColor(0xFFD700)
        .addField("Scores", string)
    message.channel.send(embed)

};

module.exports.help = {
    name: "scores"
};
