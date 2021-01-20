const Discord = require("discord.js");
const fs = require("fs");
const yaml = require('js-yaml');

const bot = new Discord.Client({ disableEveryone: true });

let Config = null;

try {
    let fileContents = fs.readFileSync('./config.yml', 'utf8');
    Config = yaml.load(fileContents);
}
catch (e) {
    console.log(e);
}

//define command collection
bot.commands = new Discord.Collection();

// command handler
fs.readdir("./commands/", (err, file) => {

    if (err) console.log(err);

    let jsfile = file.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Cant Find Commands");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        bot.commands.set(props.help.name, props);
    });
    console.clear()
    console.log("All commands loaded successfully\n");
});

//creates data files if they dont exist
const data = new Uint8Array(Buffer.from('{}'));

fs.access("data.json", fs.F_OK, (err) => {
    if (err) {
        if(err.code == "ENOENT"){
            fs.writeFile("data.json", data, (err) => {
                if (err) throw err;
                console.log("Created data.json as it didnt exist")
                return
            })
        }else{
            console.error(err)
            return
        }
    }else{
        console.log("data.json already exists")
    }
})

fs.access("scores.json", fs.F_OK, (err) => {
    if (err) {
        if(err.code == "ENOENT"){
            fs.writeFile("scores.json", data, (err) => {
                if (err) throw err;
                console.log("Created scores.json as it didnt exist")
                return
            })
        }else{
            console.error(err)
            return
        }
    }else{
        console.log("scores.json already exists")
    }
})

// D.JS Client listeners
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
//bot.on("debug", (e) => console.info(e));
bot.on('reconnecting', () => console.log('Reconnecting WS...'));
bot.on('disconnect', () => {
    console.log('Disconnected, trying to restart...');
    process.exit();
});

// NodeJS process listeners
process.on('unhandledRejection', console.error);
process.on('warning', console.warn);

//on ready statment
bot.on("ready", async() => {
    console.log("\nThe bot is now online")
    console.log("Keep this window open for the bot to run\n")
    console.log(`Invite me to a server with the following link.\nhttps://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=125952&scope=bot\n`);
    console.log("Press CTRL+C to exit\n")
    bot.user.setPresence({
        status: "online",
        activity: {
            name: Config.Settings.StatusMessage,
            type: Config.Settings.StatusType
        }
    });
});

bot.on("message", async message => {
    if (message.author.bot) return;
    let messageArray = message.content.split(" ");
    let args = messageArray.slice();
    let cmd = messageArray[0].toLowerCase();
    args = messageArray.slice(1);
    if (Config.Setup.Prefix == cmd.slice(0, 1)) {
        let Commandfile = bot.commands.get(cmd.slice(Config.Setup.Prefix.length));
        if (Commandfile) Commandfile.run(bot, message, args);
    }
});

bot.login(Config.Setup.Token);