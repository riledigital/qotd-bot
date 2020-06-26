var environment = process.env.NODE_ENV;

// CRON STUFF 4 LATER
var CronJob = require("cron").CronJob;
const envs = require("dotenv").config();
const Discord = require("discord.js");
const Airtable = require("airtable");

module.exports = class QotdBot {
  constructor(
    options = {
      AT_KEY: process.env.AT_KEY,
      AT_BASE: process.env.AT_BASE,
      DISCORD_TOKEN: process.env.DISCORD_TOKEN,
      QS_CHANNEL_NAME: "general",
    }
  ) {
    this.options = options;
    // qotdChannel, testUser, testQuestionRecord, qotdChannelName;
    // qotdChannelName = "general";
    this.client = new Discord.Client();
    this.client.login(process.env.DISCORD_TOKEN);
    this.base = new Airtable({ apiKey: process.env.AT_KEY }).base(
      this.options.AT_BASE
    );
    console.log("starting the bot!!");
  }

  cronStuff() {
    // 00 8 * * *
    var jobDailyQuestion = new CronJob(
      "00 8 * * *",
      // "* * * * * *",
      function () {
        console.log("Apparently cron is working?");
        // Trigger callback functions
        // Select random question from available
        // Send embed to
      },
      null,
      true,
      "America/New_York"
    );
    jobDailyQuestion.start();
    // END CRON STUFF 4 LATER
  }

  makeEmbed(q, author, imgUrl) {
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

  createATRecord() {
    function processMessage() {
      break;
    }
    base("responses").create(
      // list of responses to create...
      [
        {
          fields: {
            response_to: ["recfPwYz0HcyC82nx"],
          },
        },
        {
          fields: {
            response_to: ["recfPwYz0HcyC82nx"],
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      }
    );
  }

  start() {
    this.client.login(process.env.DISCORD_TOKEN).then((client) => {
      console.log(client);
      this.client.on("message", (message) => {
        console.log("on message triggered");
        if (
          message.channel.name == this.options.QS_CHANNEL_NAME &&
          message.author.bot == false
        ) {
          message.channel.send("Got the response!");
        }
        if (message.content === "ping") {
          // If the message is "ping"
          // Send "pong" to the same channel
          message.channel.send("pong");
        }
      });
    });
    // Create an event listener for messages????

    // Run if we're not in testing environment
    if (environment != "testing" && false) {
      this.client.once("ready", () => {
        console.log("Logged in, ready to roll!");
        setupBot(this.client.channel);

        qotdChannel = this.client.channels.cache.get("722617136941367296");
        qotdChannel
          .send("this some bot testing")
          .then((message) => console.log(`Sent message: ${message.content}`))
          .catch(console.error); // or this.client.channels.get("the channel id")

        fetchFirstQuestion()
          .then((q) => {
            qotdChannel.send(makeEmbed(q.body, q.author, q.image_url));
            console.log(x);
          })
          .then((x) => {
            // this.this.client.destroy();
          })
          .catch((error) => console.log);
      });
    }
  }

  fetchFirstQuestion() {
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
          let randomIndex = Math.floor(Math.random() * (4 - 0));
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
};

// Helper funcs for Discord:

// remember that node is async so this will glitch out if not in a promise chain
// this.client.destroy();
