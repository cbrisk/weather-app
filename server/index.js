const express = require('express');
const fetch = require('node-fetch');
var cors = require('cors')

const app = express();
app.use(cors());


app.get('/api/weather/:zip', (req, res, next) => {
  const zip = req.params.zip;
  fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=655dfc390726be35679ee1f171b45301`)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => {
      next(err);
    });
});


app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
