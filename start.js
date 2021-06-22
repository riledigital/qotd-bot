const config = require('./config.js');
const SimpleQotd = require('./SimpleQotd.js');

const client = new SimpleQotd(config);

client.once('ready', () => {
  switch (process.env.NODE_ENV) {
    case 'development': {
      // Ping the channel
      client
        .getQotdChannel()
        .send(
          `QOTD-Bot deployed and ready to go! Bot version: ${process.env.npm_package_version}`
        );
      break;
    }
    case 'production': {
      // Silent start. don't ping the channel
      console.log(
        `QOTD-Bot deployed and ready to go! Bot version: ${process.env.npm_package_version}`
      );
      break;
    }
  }

  client.scheduleCronDaily();
  client.on('message', (msg) => {
    if (msg.channel.id === config.QOTD_CHANNEL_ID) {
      client.handleCommand(msg, msg.content);
    }
  });
});

client.login(config.DISCORD_TOKEN);
