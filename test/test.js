// https://mochajs.org
// mocha testing
require("./../index.js");
var assert = require("assert");
// const envs = require("dotenv").config();
const Discord = require("discord.js");
// let client = new Discord.Client();

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AT_KEY }).base(
  process.env.AT_BASE
);

describe("airtable", () => {
  it("Load 1 records from a table", () => {
    base("questions")
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 1,
        view: "grid",
      })
      .firstPage(
        (err, records) => {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach(function (record) {
            // console.log("Retrieved", record.get("name"));
            records.forEach(function (record) {
              console.log("Retrieved", record.fields);
            });
          });
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  });
});

describe("login", () => {
  before(() => {
    let testUser = client.users.cache.get("322095868373106689");
  });
  beforeEach(() => {});

  it("Load discord token from env", function () {
    assert.equal(
      process.env.DISCORD_TOKEN != undefined,
      true,
      `key is ${process.env.DISCORD_TOKEN}`
    );
  });

  it("Login with Discord token", function () {
    client.login(process.env.DISCORD_TOKEN).then((data) => {
      assert(data != undefined, true, "Should get a response back");
    });
  });

  it("Send DM to Ri", function () {
    testUser.createDM().then((bot) => bot.send("this is a DM test!"));
  });
});

// describe("Array", function () {
//   describe("#indexOf()", function () {
//     it("should return -1 when the value is not present", function () {
//       assert.equal(-1, [1, 2, 3].indexOf(4));
//     });
//   });
// });
