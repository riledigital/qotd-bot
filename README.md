# Setup

set up env file like so:

```
DISCORD_TOKEN=secret
GUILD_ID=id
```

- Discord Token is from the Discord Developers site
- Get Guild ID from Discord UI, enable Developer View

# Discord Bot for QOTD

discord.js
Sequelize

## main functionality

[ ] cron-like scheduling:

[cron on npm](https://www.npmjs.com/package/cron)

[x] prompt someone to submit a question (do this thru airtable)

[x] fetch questions from airtable or some other service

[ ] keep the questions in the question database

[ ] ask questions to the qotd channel via cron jobs

[x] design a data model for QOTD in Airtable

[ ] save responses with metadata to AT; capture user metadata also

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
Unit testing a module?
