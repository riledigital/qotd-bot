// CommonJS
const config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  AIRTABLE_API_KEY: process.env.AT_KEY,
  AIRTABLE_BASE: process.env.AT_BASE,

  // Q_FREQUENCY: "* * * * * *",
  // Note that this is UTC/GMT time
  Q_FREQUENCY: '0 16 * * *',
  QOTD_CHANNEL_ID: process.env.QOTD_CHANNEL_ID,
  BOT_DISPLAY_NAME: 'QOTD-Bot',
  QUESTION_FORM_LINK: process.env.QUESTION_FORM_LINK,

  // Status server
  HOSTNAME: '0.0.0.0',
  PUBLIC_URL: 'https://discord-ask-bot.herokuapp.com/
};

module.exports = config;
