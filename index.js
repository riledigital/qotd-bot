var environment = process.env.NODE_ENV;

const envs = require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AT_KEY }).base(
  process.env.AT_BASE
);

// Variables to be used across app
let qotdChannel, testUser, testQuestionRecord;

// Helper funcs for Discord:
function makeEmbed(q, author, imgUrl) {
  // inside a command, event listener, etc.
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Question of the Day")
    .setAuthor("QOTDBot", imgUrl, "https://discord.js.org")
    .setDescription(q)
    .setThumbnail(imgUrl)
    .setFooter("question submitted by " + author, imgUrl);
  return exampleEmbed;
}

function fetchFirstQuestion() {
  return new Promise((resolve, reject) => {
    base("questions")
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 100,
        view: "grid",
      })
      .firstPage((err, records) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        // Get a random record
        let randomIndex = Math.floor(Math.random() * (3 - 0));
        let theRecord = records[randomIndex];
        // Update the date_posted field in AT
        base("questions").update(
          theRecord.id,
          {
            date_posted: new Date().toLocaleDateString(),
          },
          (err, record) => {
            if (err) {
              console.error(err);
              reject();
            }
            // console.log(record.get("date_posted"));
          }
        );
        resolve(theRecord.fields);
        // records.forEach(function (record) {
        //   console.log("Retrieved", record.fields);
        //   resolve(record.fields);
        // });
      });
  });
}

// Run if we're not in testing environment
if (environment != "testing") {
  client.once("ready", () => {
    console.log("Logged in, ready to roll!");
    setupBot(client.channel);

    qotdChannel = client.channels.cache.get("722617136941367296");
    qotdChannel
      .send("this some bot testing")
      .then((message) => console.log(`Sent message: ${message.content}`))
      .catch(console.error); // or client.channels.get("the channel id")

    fetchFirstQuestion()
      .then((q) => {
        qotdChannel.send(makeEmbed(q.body, q.author, q.image_url)).then((x) => {
          console.log(x);
          client.destroy();
        });
      })
      .catch((error) => console.log);
  });

  const setupBot = function (bot) {
    // Get the list of users
    console.log(client.users.cache);

    testUser = client.users.cache.get("322095868373106689");
    testUser.createDM().then((bot) => bot.send("this is a DM test!"));
  };

  // remember that node is async so this will glitch out if not in a promise chain
  // client.destroy();
}
