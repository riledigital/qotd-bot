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

[x] prompt someone to submit a question (do this thru airtable)
[x] fetch questions from airtable or some other service

- keep the questions in the question database, so maybe implement some sort of syncing or "migration"
- ask questions to the qotd channel
- design a data model for QOTD

```
question
title
description
date

```

# how to's - discord.js

- query channel by name (not id)

# Docs links

[Discord.js docs](https://discord.js.org/#/)
[Airtable API docs](https://airtable.com/api)

<!-- [Sequelize](https://sequelize.org/v5/) -->

# extra functionality

- persist responses, use them to generate a weekly "magazine" of user-submitted QOTDs?
