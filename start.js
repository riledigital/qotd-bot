const config = require("./config.js");
const SimpleQotd = require("./SimpleQotd.js");

const client = new SimpleQotd(config);

client.once("ready", () => {
  switch (process.env.NODE_ENV) {
    case "dev": {
      client.scheduleCronDaily();
      // Ping the channel
      client
      .getQotdChannel()
        .send(
          `QOTD-Bot deployed and ready to go! Bot version: ${process.env.npm_package_version}`
        );
    }
    default: {
      // Silent start. don't ping the channel
      console.log(
        `QOTD-Bot deployed and ready to go! Bot version: ${process.env.npm_package_version}`
      );
    }
  }

  client.scheduleCronDaily();
  client.on("message", (msg) => {
    if (msg.channel.id === config.QOTD_CHANNEL_ID) {
      client.handleCommand(msg, msg.content);
    }
  });
});

client.login(config.DISCORD_TOKEN);
