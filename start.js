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
  if (process.env.NODE_ENV !== "production") {
    client
      .getQotdChannel()
      .send(
        `QOTD-Bot deployed and ready to go! Bot version: ${process.env.npm_package_version}`
      );
  }
  console.log(
    `QOTD-Bot deployed and ready to go! Bot version: ${process.env.npm_package_version}`
  );
  client.scheduleCronDaily();
  client.on("message", (msg) => {
    // console.log(msg);

    if (msg.channel.id === config.QOTD_CHANNEL_ID) {
      client.handleCommand(msg, msg.content);
    }
  });
});

// client.commands = new Discord.Collection();
// const commandFiles = fs
//   .readdirSync("./commands")
//   .filter((file) => file.endsWith(".js"));
// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);

//   // set a new item in the Collection
//   // with the key as the command name and the value as the exported module
//   console.log(`Loaded command file: ${file}`);
//   client.commands.set(command.name, command);
// }
client.login(config.DISCORD_TOKEN);
