const config = require("./config.js");
const SimpleQotd = require("./SimpleQotd.js");

const client = new SimpleQotd(config);

client.once("ready", () => {
  // console.log("Logged in and ready!");
  // console.log(`config is ${config}`);
  // // console.log(client);
  // client.getQotdChannel().send("QOTD-Bot ready to go!");
  // client.getQotdUsers();
  // client.getAirtableQuestion();
  // client.scheduleCronTest();
  // client.taskSendQotd();
  // let urlTest = client.getMemberAvatarUrl("322095868373106689");
  // console.log(urlTest);
  client.run();
});

client.login(config.DISCORD_TOKEN);
