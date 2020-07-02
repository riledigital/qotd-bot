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
  }

  static questionAsEmbed(q, author = "QOTD-Bot", imgUrl) {
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor("#ffff00")
      .setTitle("Question of the Day")
      .setAuthor("QOTD-Bot", imgUrl, "http://github.com/rl2999/qotd-bot/")
      .setDescription(q + " @everyone")
      .setThumbnail(imgUrl)
      .setFooter("question submitted by " + author, imgUrl);
    return exampleEmbed;
  }

  taskSendQotd() {
    let q = this.getAirtableQuestion()
      .then((q) => {
        console.log(q);
        this.getQotdChannel().send(
          SimpleQotd.questionAsEmbed(q.body, q.author, q.image_url)
        );
      })
      .catch((e) => {
        console.log("No new questions; please send in more!");
        let msg = "There are no new questions. Please submit more questions!";
        this.getQotdChannel().send(
          new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No new questions!")
            .setAuthor("QOTD-Bot", "", "http://github.com/rl2999/qotd-bot/")
            .setDescription(msg)
        );
      });
  }

  cronRunQotd() {
    console.log("Running cron: ");
  }

  scheduleCronTest() {
    schedule.scheduleJob(config.Q_FREQUENCY, () => {
      this.cronRunQotd();
    });
  }

  getQotdChannel() {
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

  getAirtableQuestion() {
    return new Promise((resolve, reject) => {
      this.base("questions")
        .select({
          // Selecting the first 3 records in grid:
          maxRecords: 3,
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
