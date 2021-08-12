const express = require('express');
const nunjucks = require('nunjucks');
const config = require('./config');
class StatusServer {
  constructor () {
    const app = express();
    const PORT = process.env.PORT || 3000;

    nunjucks.configure('templates', {
      autoescape: true,
      express: app
    });

    app.get('/', (req, res) => {
      // call getContext
      const context = this.getContext();
      console.log(context);
      res.render('index.html', context);
    });

    app.listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`);
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
