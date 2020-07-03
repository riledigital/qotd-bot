const config = require("./config.js");
const SimpleQotd = require("./SimpleQotd.js");

const client = new SimpleQotd(config);

client.once("ready", () => {
  console.log("Logged in and ready!");
  console.log(`config is ${config}`);
  // console.log(client);
  client.getQotdChannel().send("QOTD-Bot ready to go!");
  // client.getQotdUsers();
  // client.getAirtableQuestion();
  client.scheduleCronTest();
  client.taskSendQotd();
  let urlTest = client.getMemberAvatarUrl("322095868373106689");
  console.log(urlTest);
});

client.login(config.DISCORD_TOKEN);

client.on("message", (msg) => {
  console.log(msg);

  if (msg.channel.id === config.QOTD_CHANNEL_ID) {
    if (msg.content === "!submit") {
      msg.reply(
        `Here's the form for submitting questions: ${config.QUESTION_FORM_LINK}`
      );
    }

    if (msg.content === "!resume") {
      msg.reply("👌🟢 Starting QOTD... run !resume to resume questions.");
      console.log("Starting QOTD...");
      client.scheduleCronTest();
    }

    if (msg.content === "!pause") {
      msg.reply("✋🛑 Pausing QOTD... run !resume to resume questions.");
      console.log("Pausing QOTD...");
      client.cronDaily.cancel();
    }
  }
});
