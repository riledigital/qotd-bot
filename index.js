const config = require('./config.js');

let envPath = '.env.development';

switch (process.env.NODE_ENV) {
  case 'production': {
    envPath = '.env.production';
    break;
  }

  case 'development': {
    envPath = '.env.development';
    break;
  }
}

const envs = require('dotenv').config({ path: envPath });

const SimpleQotd = require('./SimpleQotd.js');
const StatusServer = require('./StatusServer.js');

const client = new SimpleQotd(config);

function startStatus (client) {
  // Set up a status server
  const statusServer = new StatusServer();
  // Wire up the update function to the web server
  statusServer.setUpdater(client.statusUpdater);
}

startStatus(client);

client.once('ready', () => {
  switch (process.env.NODE_ENV) {
    case 'development': {
      // // Ping the channel
      // client
      //   .qotdChannel
      //   .send(
      //     `QOTD-Bot deployed and ready to go! Bot version: ${process.env.npm_package_version}`
      //   );
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
