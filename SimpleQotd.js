const schedule = require('node-schedule');

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

  sendToChannel (msg) {
    this.channels.fetch(this.config.QOTD_CHANNEL_ID)
      .then(channel => {
        channel.send(msg);
        return msg;
      })
      .catch(err => console.log(err));
  }

  statusUpdater () {
    // Passed to the status web server
    return {
      context: {
        status: 'QOTD is live and listening.',
        test: 'testing',
        nextInvocation: this.cronDaily.nextInvocation(),
        paused: this.paused,
        lastQuestion: this.lastQuestion
      }
    };
  }

  taskSendQotd () {
    this.getAirtableQuestion(this.base)
      .then((record) => {
        const { body, author, imageUrl } = record.fields;
        this.sendToChannel(
          questionAsEmbed(body, author, imageUrl || 'http://placekitten.com/50/50')
        );
      })
      .catch((e) => {
        console.error(e);
        console.log('No new questions; please send in more!');
        const msg = `There are no new questions. 😥 Please submit more questions at ${this.config.QUESTION_FORM_LINK} 🙏`;
        this.sendToChannel(
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
      this.sendToChannel(`Next scheduled QOTD is on ${estTime}`);
    }
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
      // const estTime = this.cronDaily.nextInvocation().toLocaleString('en-US', {
      //   timeZone: 'America/New_York'
      // });
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
        msg.reply(`Next invocation is: ${this.cronDaily.nextInvocation()}. Status page: ${this.statusPageUrl}`);
        break;
      }
      case '!skip': {
        msg.reply("Skipping this question... here's another one:");
        try {
          if (this.lastQuestion) {
            this.updateRecordSkipped(this.lastQuestion.get('question_id'));
          }
        } catch (err) {
          console.error(err);
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

  setLastQuestion (data) {
    this.lastQuestion = data;
  }

  getAirtableQuestion (base) {
    /**
     * Get n questions and return one among them
     */
    return new Promise((resolve, reject) => {
      base('questions')
        .select({
          // Selecting the first 3 records in grid:
          maxRecords: 3,
          view: 'grid',
          // Only get unused questions
          filterByFormula: 'has_used = 0'
        })
        .eachPage(
          (records, fetchNextPage) => {
            if (records.length === 0) {
              console.log('No records to use!');
              reject(new Error('Error: base returned no records matching criteria!'));
            } else {
              // Pick a random index
              const index = Math.floor(Math.random() * (records.length - 1));
              const theRecord = records[index];
              updateRecordUsed(base, theRecord.id);
              this.setLastQuestion(theRecord);
              resolve(theRecord);
            }
          },
          (err) => {
            if (err) {
              console.error(err);
              reject(err);
            }
          }
        );
    });
  }
}

const questionAsEmbed = (q, author, imgUrl) => {
  // inside a command, event listener, etc.
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Question of the Day')
    .setAuthor(
      author,
      imgUrl,
      'http://github.com/riledigital/qotd-bot/'
    )
    .setDescription(q + ' @everyone')
    .setThumbnail(imgUrl)
    .setFooter('question submitted by ' + author, imgUrl);
  return exampleEmbed;
};

const updateRecordUsed = function (base, id) {
  base('questions').update(
    [
      {
        id: id,
        fields: {
          date_posted: new Date().toLocaleDateString()
        }
      }
    ],
    (err, records) => {
      if (err) {
        console.log(err);
        return;
      }

      records.forEach((record) => {
        console.log(
            `Updated record ${record.get('question_id')} with ${record.get(
              'date_posted'
            )}`
        );
      });
    }
  );
};

module.exports = SimpleQotd;
