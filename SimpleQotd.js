var environment = process.env.NODE_ENV;

// CRON STUFF 4 LATER
var schedule = require("node-schedule");
const envs = require("dotenv").config();
const Discord = require("discord.js");
const Airtable = require("airtable");

// CLASS DEFINITION

class SimpleQotd extends Discord.Client {
  constructor(config) {
    super(config);
    this.config;

    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: config.AIRTABLE_API_KEY,
    });
    this.base = Airtable.base(config.AIRTABLE_BASE);
    this.cronDaily;
  }

  getMemberAvatarUrl(memberId) {
    // this.users.cache.fetch(memberId).then((user) => {
    //   return user.avatarURL();
    // });
    return;
  }

  static questionAsEmbed(q, author = config.BOT_DISPLAY_NAME, imgUrl) {
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor("#ffff00")
      .setTitle("Question of the Day")
      .setAuthor(
        config.BOT_DISPLAY_NAME,
        // imgUrl,
        "http://github.com/rl2999/qotd-bot/"
      )
      .setDescription(q + " @everyone")
      .setThumbnail(imgUrl)
      .setFooter("question submitted by " + author, imgUrl);
    return exampleEmbed;
  }

  taskSendQotd() {
    this.getAirtableQuestion()
      .then((q) => {
        // console.log(q);
        this.getQotdChannel().send(
          SimpleQotd.questionAsEmbed(q.body, q.author, q.image_url)
        );
      })
      .catch((e) => {
        if (e) {
          console.log("No new questions; please send in more!");
          let msg = `There are no new questions. 😥 Please submit more questions at ${config.QUESTION_FORM_LINK} 🙏`;
          this.getQotdChannel().send(
            new Discord.MessageEmbed()
              .setColor("#ff0000")
              .setTitle("No new questions!")
              .setAuthor(
                config.BOT_DISPLAY_NAME,
                "",
                "http://github.com/rl2999/qotd-bot/"
              )
              .setDescription(msg)
          );
        }
      });
  }

  cronRunQotd() {
    // This is run on a schedule...
    console.log(`Running cron with ${config.Q_FREQUENCY}`);
    // Fetch + send the message
    this.taskSendQotd();
  }

  scheduleCronStop() {
    console.log("Cancelling daily questions!");
    if (this.cronDaily) {
      this.cronDaily.cancel();
    }
  }

  scheduleCronTest() {
    if (!this.cronDaily) {
      this.cronDaily = schedule.scheduleJob(config.Q_FREQUENCY, () => {
        this.cronRunQotd();
      });
      console.log(
        `Next scheduled QOTD is on ${this.cronDaily.nextInvocation()}`
      );
      this.getQotdChannel().send(
        `Next scheduled QOTD is on ${this.cronDaily.nextInvocation()}`
      );
    }
  }

  getQotdChannel() {
    // return this.channels
    //   .fetch(config.QOTD_CHANNEL_ID)
    //   .then((channel) => channel)
    //   .catch(console.error);
    return this.channels.cache.get(config.QOTD_CHANNEL_ID);
  }

  getQotdUsers() {
    let chan = this.channels.cache.get(config.QOTD_CHANNEL_ID);
    // Currently returns non-bots
    return chan.members.filter((x) => !x.user.bot);
  }

  updateRecordUsed(id) {
    this.base("questions").update(
      [
        {
          id: id,
          fields: {
            date_posted: new Date().toLocaleDateString(),
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.log(err);
          return;
        }

        records.forEach(function (record) {
          console.log(
            `Updated record ${record.get("question_id")} with ${record.get(
              "date_posted"
            )}`
          );
        });
      }
    );
  }

  handleResume(msg) {
    msg.reply("👌🟢 Starting QOTD... run !resume to resume questions.");
    console.log("Starting QOTD...");
    client.scheduleCronTest();
  }

  handleSubmit(msg) {
    msg.reply(
      `Here's the form for submitting questions: ${config.QUESTION_FORM_LINK}`
    );
  }

  handlePause(msg) {
    msg.reply("✋🛑 Pausing QOTD... run !resume to resume questions.");
    console.log("Pausing QOTD...");
    client.cronDaily.cancel();
  }

  getAirtableQuestion() {
    return new Promise((resolve, reject) => {
      let recordsTofetch = 50;
      this.base("questions")
        .select({
          // Selecting the first 3 records in grid:
          maxRecords: recordsTofetch,
          view: "grid",
          // Only get unused questions
          filterByFormula: "has_used = 0",
        })
        .eachPage(
          (records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.
            // We can use arrow funcs here to use the class methods since function creates 'this' bindings
            if (records.length === 0) {
              console.log("No records to use!");
              reject("base returned no records matching criteria!");
            } else {
              records.forEach((record) => {
                let recId = record.get("question_id");
                // console.log("Retrieved", recId);
                // this.updateRecordUsed(recId);
              });
              let index = Math.floor(Math.random() * (records.length - 1));
              let theRecord = records[index];
              this.updateRecordUsed(theRecord.get("question_id"));
              // return theRecord.fields;
              resolve(theRecord.fields);
              // To fetch the next page of records, call `fetchNextPage`.
              // If there are more records, `page` will get called again.
              // If there are no more records, `done` will get called.
              // fetchNextPage();
            }
          },
          (err) => {
            if (err) {
              console.error(err);
              // return err;
              reject(err);
            }
          }
        );
    });
  }
}

module.exports = SimpleQotd;
