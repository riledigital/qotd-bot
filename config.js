const envs = require("dotenv").config();
// CommonJS
config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  AIRTABLE_API_KEY: process.env.AT_KEY,
  AIRTABLE_BASE: process.env.AT_BASE,

  // Q_FREQUENCY: "* * * * * *",
  // Note that this is UTC/GMT time
  Q_FREQUENCY: "0 16 * * *",
  QOTD_CHANNEL_ID: process.env.QOTD_CHANNEL_ID,
  BOT_DISPLAY_NAME: "QOTD-Bot",
  QUESTION_FORM_LINK: process.env.QUESTION_FORM_LINK,
};

module.exports = config;
