const config = require("./config.js");
const SimpleQotd = require("./SimpleQotd.js");

const client = new SimpleQotd();

client.once("ready", () => {
  console.log("Ready!");
  console.log(`config is ${config}`);
});

client.login(config.DISCORD_TOKEN);
