# Qotd-Bot

Qotd-Bot (QB) is a Discord bot that automatically sends a question of the day to a specific channel. Qotd-Bot is designed to make it easy to keep a conversation going in a Discord thread. Every 2 days (or a custom interval), QB requests a user to submit a question by sending an Airtable form.

QB uses Airtable as a database for persistence, storing records of when questions have been used.

QB compiles responses from respondents and persists them to a separate Airtable base, and generates a bi-weekly zine site for fun memories!

# Commands

| Command Trigger | Description |
| ---- | ---- |
| `!pause` | Temporarily stops qotd prompts. |
| `!skip` | Reroll for another question. This consumes the previous question in the database. |
| ---- | ---- |
| ---- | ---- |

| ---- | ---- |


# Setup

## Requirements

- Node.js >14.4.0
- Discord developer key
- Airtable developer key
- A pre-configured Airtable base

The bot will read from a config.js file [per the Discord.js guide.](https://discordjs.guide/creating-your-bot/configuration-files.html)

- Get the Discord Token from [the Discord Developers site](https://discord.com/developers/applications)
- Get the guild ID from the Discord UI, [enable Developer View](https://discord.com/developers/docs/intro)
- Get the Airtable keys from the [Airtable API docs](https://airtable.com/api)

## Configuration

The configuration exists in two places: `.env` for secrets, and `config.js` for other options.

| Option            | Default         | Description                                                                                                                |
| ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Q_FREQUENCY`     | `* 30 10 * * *` | The schedule to send out QOTD's, in `cron` format. This is in UTC, so use a time zone converter to get the right schedule. |
| `QOTD_CHANNEL_ID` | `null`          | The default Channel ID to send QOTD's to. Use the Discord dev tools to copy the Channel ID.                                |

# Checkpoints

[x] Load setup and config keys/preferences for bot

- Airtable key
- Discord key
- Frequency of questions
- Airtable base key
- Airtable base names

[ ] Get users from Discord

[ ][collect responses to questions](https://discordjs.guide/popular-topics/collectors.html#await-messages)

### Discord functions

[x] Create embed message
[x] Send any message to the QOTD channel
[ ] Schedule message sending by cron syntax

### Airtable functions

[ ] Get question from Airtable

- Fetch /n/ records WHERE date_used IS null
- Pick a random of /n/
  [x] Update the date for a record to current date/time
  [ ]

# Test cases

## Database

- Get a record from Airtable
- Update a record successfully
- Remove a record

## Discord

- Send a message to channel
- Make an embed
- Successfully get channel

## main functionality

[ ] cron-like scheduling

[x] prompt someone to submit a question (do this thru airtable)

[x] fetch questions from airtable or some other service

[ ] keep the questions in the question database

[ ] ask questions to the qotd channel via cron jobs

[x] design a data model for QOTD in Airtable

[ ] save responses with metadata to AT; capture user metadata also

[ ] capture a response and get data from all users

- https://discordjs.guide/popular-topics/collectors.html

IF user opts in to participate, the bot will request questions from them

# how to's - discord.js

- query channel by name (not id)

# Docs links

[Discord.js docs](https://discord.js.org/#/)
[Airtable API docs](https://airtable.com/api)

<!-- [Sequelize](https://sequelize.org/v5/) -->

# extra functionality

- persist responses, use them to generate a weekly "magazine" of user-submitted QOTDs?

# Learning stuff

[Module system in Node](https://nodejs.org/api/modules.html)

[Unit testing a module with Mocha](https://www.digitalocean.com/community/tutorials/how-to-test-a-node-js-module-with-mocha-and-assert)
