const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const port = 80;

nunjucks.configure('templates', {
  autoescape: true,
  express: app
});

app.get('/', function (req, res) {
  const context = {
    status: 'running'
  };
  res.render('index.html', context);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
