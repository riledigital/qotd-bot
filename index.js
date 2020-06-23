const envs = require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

let questions = [
  {
    'question': 'what is this question',
    'author': 'Ri'
  }
];

function makeEmbed(q, author) {
  // inside a command, event listener, etc.
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(q)
    .setAuthor(
      "QOTDBot",
      "https://i.imgur.com/wSTFkRM.png",
      "https://discord.js.org"
    )
    .setDescription(q)
    .setThumbnail("https://i.imgur.com/wSTFkRM.png")
    .setFooter("by " + author, "https://i.imgur.com/wSTFkRM.png");
    return exampleEmbed;
}

client.once("ready", () => {
  // let CLIENT_ID = '718106055594344559'
  // const ADD_APP = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot`
  console.log("Logged in, ready to roll!");
  setupBot(client.channel);

  let channel = client.channels.cache.get("722617136941367296");
  channel
    .send("this some bot testing")
    .then((message) => console.log(`Sent message: ${message.content}`))
    .catch(console.error); // or client.channels.get("the channel id")

  channel.send(makeEmbed('Question of the day!', 'Ri')).then( x => {
    console.log(x);
    client.destroy();
  });
});

const setupBot = function(bot) {
  // Get the list of users
  console.log(client.users.cache)
  client.users.cache.get('322095868373106689').createDM()
    .then(bot => bot.send("this is a DM test!"));
}
// client.destroy();
