const config = require("./config.js");
const SimpleQotd = require("./SimpleQotd.js");

const client = new SimpleQotd(config);

client.once("ready", () => {
  console.log("Logged in and ready!");
  console.log(`config is ${config}`);
  // console.log(client);
  client.getQotdChannel().send("lol test");
  // client.getQotdUsers();
  // client.getAirtableQuestion();
  // client.scheduleCronTest();
  client.taskSendQotd();
});

client.login(config.DISCORD_TOKEN);
