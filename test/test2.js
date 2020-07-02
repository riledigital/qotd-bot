var assert = require("assert");
const config = require("../config.js");
const SimpleQotd = require("../SimpleQotd.js");
const { doesNotMatch } = require("assert");

// const client = new SimpleQotd(config);
const testClient = new SimpleQotd(config);

describe("Getter functions", () => {
  let channel;
  before(function () {
    console.log("Setting up bot...");
    testClient.login(config.DISCORD_TOKEN).then(() => {
      console.log("woooooo");
    });
    testClient.once("ready", () => {
      console.log("Logged in and ready!");
      channel = testClient.getQotdChannel();
      return;
    });
  });

  it("qotdChannel exists", () => {
    console.log(channel);
    // testClient.getQotdChannel().then((chan) => console.log(chan));
    assert.ok(channel, "Should not be undefined?...");
  });

  after(() => {
    testClient.destroy();
  });
});
