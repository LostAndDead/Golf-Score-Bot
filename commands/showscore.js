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

    //let entries = 0
    //for (let item in objSorted) {
    //    if (entries < 10){
    //        if(scoresData[item].length == 2){
    //            string += (`<@${item}> Total Score: \`${objSorted[item]}\`\nRound 1: \`${scoresData[item][0]}\`    Round 2: \`${scoresData[item][1]}\`\n`)
    //        }else{
    //            string += (`<@${item}> Total Score: \`${objSorted[item]}\`\nRound 1: \`${scoresData[item][0]}\` Round 2: \`TBD\`\n`)
    //        }
    //        entries++
    //    }
    //}

    let count = 0
    let messages = 0
    let remaining = Object.keys(objSorted).length
    for (let item in objSorted){
        if(scoresData[item].length == 2){
            string += (`<@${item}> Total Score: \`${objSorted[item]}\`\nRound 1: \`${scoresData[item][0]}\`    Round 2: \`${scoresData[item][1]}\`\n`)
        }else{
            string += (`<@${item}> Total Score: \`${objSorted[item]}\`\nRound 1: \`${scoresData[item][0]}\` Round 2: \`TBD\`\n`)
        }
        count++
        remaining--
        if (count == 10){
            messages ++
            let embed = new Discord.MessageEmbed()
                .setColor(0xFFD700)
                .addField("Scores Page: " + messages, string)
            await message.channel.send(embed)
            string = ""
            count = 0
        }
    }

    let embed = new Discord.MessageEmbed()
        .setColor(0xFFD700)
        .addField("Scores Page: " + (messages + 1), string)
    message.channel.send(embed)
};

module.exports.help = {
    name: "scores"
};
