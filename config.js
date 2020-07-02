const envs = require("dotenv").config();
// CommonJS
config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  AIRTABLE_API_KEY: process.env.AT_KEY,
  AIRTABLE_BASE: process.env.AT_BASE,
  Q_FREQUENCY: "* * * * * *",
  QOTD_CHANNEL_ID: "726536218753368206",
};

module.exports = config;
