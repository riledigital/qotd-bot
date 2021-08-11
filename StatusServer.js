const express = require('express');
const nunjucks = require('nunjucks');
const config = require('./config');
class StatusServer {
  constructor () {
    const app = express();
    // const port = config.PORT;
    const port = process.env.PORT ?? 3000;

    nunjucks.configure('templates', {
      autoescape: true,
      express: app
    });

    app.get('/', (req, res) => {
      // call getContext
      res.render('index.html', this.getContext());
    });

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }

  getContext () {
    // the bot should override this function to update the server context.
    const defaultContext = {
      status: 'Setting up...'
    };
    return defaultContext;
  }

  setUpdater (func) {
    this.getContext = func;
  }
}

if (require.main === module) {
  const server = new StatusServer();
} else {
  console.log('required as a module');
}

module.exports = StatusServer;
