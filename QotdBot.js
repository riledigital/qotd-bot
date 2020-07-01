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
      QS_CHANNEL_NAME: "qotd-s",
      QS_CHANNEL_ID: "726536218753368206",
    }
  ) {
    this.options = options;
    // qotdChannel, testUser, testQuestionRecord, qotdChannelName;
    // qotdChannelName = "general";
    this.client = new Discord.Client();
    this.client.login(this.options.DISCORD_TOKEN).then((cl) => {
      console.log(`Logged in with ${cl}`);
    });
    this.base = new Airtable({ apiKey: this.options.AT_KEY }).base(
      this.options.AT_BASE
    );
    console.log("Starting the bot!!");

    this.hasInitGuild = false;
    this.userList = [];
    this.members;
    this.qotdChannel;

    // Set up the bot by connecting and initializing variables
    this.client.once("ready", () => {
      console.log("Logged in, ready to roll!");
      this.getQotdChannel()
        .then((channel) => {
          this.qotdChannel = channel;
        })
        .then((channel) => {
          console.log(channel);
          this.setupCron();
        });
    });
  }

  getQotdChannel() {
    return new Promise((resolve, reject) => {
      console.log("Getting qotdchannel object");
      try {
        this.client.channels
          .fetch(this.options.QS_CHANNEL_ID)
          .then((channel) => {
            console.log(`got ${channel}`);
            resolve(channel);
          });
      } catch (e) {
        console.log(`No channels!!! ${e}`);
        reject(e);
      }
    });
  }

  cronCallback() {
    console.log("Cron func running?");
    // Trigger callback functions
    // Select random question from available
    // Send embed to
    // this.getQotdChannel().then((channel) => channel.send("Lol cron test!"));

    try {
      this.qotdChannel.send("Lol cron test!");
    } catch (e) {
      console.log(e);
    }

    // this.fetchFirstQuestion(this.base("questions")).then((q) => {
    //   this.qotdChannel.send(this.makeEmbed(q.body, q.author, q.image_url));
    //   console.log(q);
    // });
  }

  setupCron(cronString = "15 * * * * *") {
    let jobDailyQuestion = new CronJob(
      cronString,
      this.cronCallback()
      // null,
      // true
      // "America/New_York"
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
  }

  start() {
    if (!this.qotdChannel) {
      this.qotdChannel = this.client.channels.cache.get(
        this.options.QS_CHANNEL_ID
      );
      this.setupCron();
    }

    this.client.on("message", (message) => {
      if (message.author.bot) return;

      // Get the guild members
      message.guild.members.fetch().then((memberCollection) => {
        console.log("fetched mems:");
        console.log(memberCollection);
        this.members = memberCollection;
        return memberCollection;
      });

      this.members.each((k, v, m) => {
        this.base("responses").create(v, function (err, records) {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach(function (record) {
            console.log(record);
          });
        });
      });

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

    // Create an event listener for messages????

    // Run if we're not in testing environment
    if (environment != "testing" && false) {
    }
  }

  getGuild() {
    return new Promise((resolve, reject) => {
      try {
        theGuild = this.client.guilds.cache.first();
        resolve(theGuild);
      } catch (e) {
        reject(e);
      }
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      // TODO: fetch the data structure with all users
      this.getGuild.then(() => {
        this.base("responses").create(
          gs.map((x) => x.data),
          function (err, records) {
            if (err) {
              console.error(err);
              reject(err);
            }
            records.forEach((record) => {
              console.log(record);
            });

            resolve(records);
          }
        );
      });
    });
  }

  fetchFirstQuestion(base) {
    return new Promise((resolve, reject) => {
      base
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
          base.update(
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
