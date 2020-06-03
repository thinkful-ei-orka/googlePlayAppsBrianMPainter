const express = require('express');
const morgan = require('morgan')

const app = express();

app.use(morgan('common'));
const googlePlayApps = require('./playstore')



app.get('/playApps', (req, res) => {
  const goodSorts = ['Rating', 'App'];
  const genresFilter = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  const { genres, sort } = req.query;
  let currentResponse = [...googlePlayApps];

  if (sort && !goodSorts.includes(sort)) {
    return res
      .status(400)
      .json({ error: 'Sort query must be of "rating" or "app"' });
  }

  if (sort) {
    currentResponse.sort((a, b) => {
      if (a[sort] < b[sort]) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  if (genres && !genresFilter.includes(genres)) {
    return res
      .status(400)
      .json({ error: 'Not a valid genres' });
  }

  if (genres) {
    currentResponse = currentResponse.filter(result =>
      result.Genres.includes(genres)
    );
  }
  
  res.json(currentResponse);

});

module.exports = app;
