const express = require('express');
const fetch = require('node-fetch');
const pg = require('pg');
var cors = require('cors');
const staticMiddleware = require('./static-middleware');


const app = express();

app.use(cors());
app.use(staticMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/api/weather/:zip', (req, res, next) => {
  const zip = req.params.zip;
  fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=${process.env.API_KEY}`)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => {
      next(err);
    });
});

app.post('/api/weather/:zip', (req, res, next) => {
  const zip = req.params.zip;
});

app.delete('/api/weather/:zip', (req, res, next) => {
  const zip = req.params.zip;
});

app.listen(process.env.PORT, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
});
