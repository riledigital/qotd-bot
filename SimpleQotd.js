const schedule = require('node-schedule');
const envs = require('dotenv').config();
const Discord = require('discord.js');
const Airtable = require('airtable');
class SimpleQotd extends Discord.Client {
  constructor (config) {
    super(config);
    this.config = config;
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: config.AIRTABLE_API_KEY
    });
    this.base = Airtable.base(this.config.AIRTABLE_BASE);
    this.cronDaily = '';
    this.lastQuestion = null;
    this.paused = false;
  }

  questionAsEmbed (q, author = this.config.BOT_DISPLAY_NAME, imgUrl) {
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Question of the Day')
      .setAuthor(
        this.config.BOT_DISPLAY_NAME,
        // imgUrl,
        'http://github.com/riledigital/qotd-bot/'
      )
      .setDescription(q + ' @everyone')
      .setThumbnail(imgUrl)
      .setFooter('question submitted by ' + author, imgUrl);
    return exampleEmbed;
  }

  taskSendQotd () {
    this.getAirtableQuestion()
      .then((q) => {
        // console.log(q);
        this.getQotdChannel().send(
          this.questionAsEmbed(q.body, q.author, q.image_url)
        );
      })
      .catch((e) => {
        if (e) {
          console.log('No new questions; please send in more!');
          const msg = `There are no new questions. 😥 Please submit more questions at ${this.config.QUESTION_FORM_LINK} 🙏`;
          this.getQotdChannel().send(
            new Discord.MessageEmbed()
              .setColor('#ff0000')
              .setTitle('No new questions!')
              .setAuthor(
                this.config.BOT_DISPLAY_NAME,
                '',
                'http://github.com/riledigital/qotd-bot/'
              )
              .setDescription(msg)
          );
        }
      });
  }

  cronRunQotd () {
    // This is run on a schedule...
    console.log(`Running cron with ${this.config.Q_FREQUENCY}`);
    // Fetch + send the message
    this.taskSendQotd();
  }

  scheduleCronStop () {
    console.log('Cancelling daily questions!');
    if (this.cronDaily) {
      this.cronDaily.cancel();
    }
  }

  scheduleCronDaily () {
    this.cronDaily = schedule.scheduleJob(this.config.Q_FREQUENCY, () => {
      this.cronRunQotd();
    });
    const estTime = this.cronDaily.nextInvocation().toLocaleString('en-US', {
      timeZone: 'America/New_York'
    });
    // let fmtTime = new Date(estTime).toISOString();
    console.log('Starting QOTD...');
    console.log(`Next scheduled QOTD is on ${estTime}`);
    if (process.env.NODE_ENV === 'dev') {
      this.getQotdChannel().send(`Next scheduled QOTD is on ${estTime}`);
    }
  }

  getQotdChannel () {
    // return this.channels
    //   .fetch(this.config.QOTD_CHANNEL_ID)
    //   .then((channel) => channel)
    //   .catch(console.error);
    return this.channels.cache.get(this.config.QOTD_CHANNEL_ID);
  }

  getQotdUsers () {
    const chan = this.channels.cache.get(this.config.QOTD_CHANNEL_ID);
    // Currently returns non-bots
    return chan.members.filter((x) => !x.user.bot);
  }

  updateRecordUsed (id) {
    this.base('questions').update(
      [
        {
          id: id,
          fields: {
            date_posted: new Date().toLocaleDateString()
          }
        }
      ],
      function (err, records) {
        if (err) {
          console.log(err);
          return;
        }

        records.forEach(function (record) {
          console.log(
            `Updated record ${record.get('question_id')} with ${record.get(
              'date_posted'
            )}`
          );
        });
      }
    );
  }

  updateRecordSkipped (id) {
    console.log(`Skipped qusetion ${id}`);
    this.base('questions').update(
      [
        {
          id: id,
          fields: {
            skipped: true
          }
        }
      ],
      function (err, records) {
        if (err) {
          console.log(err);
          return;
        }

        records.forEach(function (record) {
          console.log(
            `Updated record ${record.get('question_id')} with ${record.get(
              'date_posted'
            )}`
          );
        });
      }
    );
  }

  getNextTime () {
    try {
      const preTime = this.cronDaily.nextInvocation();
      const estTime = this.cronDaily.nextInvocation().toLocaleString('en-US', {
        timeZone: 'America/New_York'
      });
      return preTime;
    } catch (e) {
      return null;
    }
  }

  handleCommand (msg, triggerWord) {
    // let preTime, estTime;
    switch (triggerWord) {
      case '!help': {
        const msgIntro = `You can submit questions through the form located at ${this.config.QUESTION_FORM_LINK}! 
      If you are looking for my code or available commands, they are available at 
      https://github.com/riledigital/qotd-bot.
      If you have any questions about me, ask my creator Ri!
      `;
        msg.reply(msgIntro);
        break;
      }
      case '!status': {
        msg.reply(`Next invocation is: ${this.cronDaily.nextInvocation()}`);
        break;
      }
      case '!skip': {
        msg.reply("Skipping this question... here's another one:");
        try {
          this.updateRecordSkipped(this.lastQuestion.get('question_id'));
        } catch (e) {
          console.log(`Error: ${e}`);
        }

        this.taskSendQotd();
        break;
      }
      case '!resume': {
        if (this.paused) {
          this.paused = false;
          this.scheduleCronDaily();
          msg.reply('👌🟢 Starting QOTD... run !pause to pause questions.}');
          break;
        } else {
          msg.reply(
            `QOTD is still running! Next one is at ${this.cronDaily.nextInvocation()}`
          );
          return null;
          break;
        }
      }

      case '!submit': {
        msg.reply(
          `Here's the form for submitting questions: ${this.config.QUESTION_FORM_LINK}`
        );
        break;
      }

      case '!pause': {
        if (this.paused) {
          msg.reply('Already paused. Type !resume to continue QOTD.');
          return null;
        } else {
          this.paused = true;
          msg.reply('✋🛑 Pausing QOTD... run !resume to resume questions.');
          this.scheduleCronStop();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  collectResponse () {
    const responseTo = this.lastQuestion.get('question_id');
  }

  getAirtableQuestion () {
    return new Promise((resolve, reject) => {
      const recordsTofetch = 50;
      this.base('questions')
        .select({
          // Selecting the first 3 records in grid:
          maxRecords: recordsTofetch,
          view: 'grid',
          // Only get unused questions
          filterByFormula: 'has_used = 0'
        })
        .eachPage(
          (records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.
            // We can use arrow funcs here to use the class methods since function creates 'this' bindings
            if (records.length === 0) {
              console.log('No records to use!');
              reject(new Error('Error: base returned no records matching criteria!'));
            } else {
              records.forEach((record) => {
                const recId = record.get('question_id');
                // console.log("Retrieved", recId);
                // this.updateRecordUsed(recId);
              });
              const index = Math.floor(Math.random() * (records.length - 1));
              const theRecord = records[index]?.fields;
              this.updateRecordUsed(theRecord.question_id);

              // return theRecord.fields;
              this.lastQuestion = theRecord.fields;
              resolve(theRecord);
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
