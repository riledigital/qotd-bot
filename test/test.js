// https://mochajs.org
// mocha testing
const QotdBot = require("../QotdBot.js");
const envs = require("dotenv").config();

const qbot = new QotdBot({
  AT_KEY: process.env.AT_KEY,
  AT_BASE: process.env.AT_BASE,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  QS_CHANNEL_NAME: "general",
});
var assert = require("assert");

describe("airtable", () => {
  before(() => {
    console.log("Setting up tests");
  });

  it("Retrieve list of users from AT", () => {
    qbot.getAllUsers().then((data) => {
      console.log(data);
      done();
    });
  });

  // it("Load 1 records from a table", () => {
  //   base("questions")
  //     .select({
  //       // Selecting the first 3 records in Grid view:
  //       maxRecords: 1,
  //       view: "grid",
  //     })
  //     .firstPage(
  //       (err, records) => {
  //         if (err) {
  //           console.error(err);
  //           return;
  //         }
  //         records.forEach(function (record) {
  //           // console.log("Retrieved", record.get("name"));
  //           records.forEach(function (record) {
  //             console.log("Retrieved", record.fields);
  //           });
  //         });
  //       },
  //       function done(err) {
  //         if (err) {
  //           console.error(err);
  //           return;
  //         }
  //       }
  //     );
  // });
});
// describe("Discord messaging", () => {
//   // it("Send DM to Ri", function () {
//   //   testUser = client.users.cache.get("322095868373106689");
//   //   testUser.createDM().then((bot) => bot.send("this is a DM test!"));
//   // });
// });

// describe("Array", function () {
//   describe("#indexOf()", function () {
//     it("should return -1 when the value is not present", function () {
//       assert.equal(-1, [1, 2, 3].indexOf(4));
//     });
//   });
// });
