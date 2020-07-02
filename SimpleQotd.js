var environment = process.env.NODE_ENV;

// CRON STUFF 4 LATER
var schedule = require("node-schedule");

const envs = require("dotenv").config();
const { Client } = require("discord.js");
const Airtable = require("airtable");

// CLASS DEFINITION

class SimpleQotd extends Client {
  constructor(config) {
    super(config);
  }
}

module.exports = SimpleQotd;
