require('dotenv/config');
const express = require('express');
const fetch = require('node-fetch');
const pg = require('pg');
const staticMiddleware = require('./static-middleware');


const app = express();

app.use(staticMiddleware);

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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

app.get('/api/favorites', (req, res, next) => {
  const sql = `
    select *
    from "favorites"
    order by "city"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      next(err);
    });
});

app.post('/api/favorites', (req, res, next) => {
  const { zip, name } = req.body;
  const sql = `
    insert into "favorites" ("zip", "city")
    values ($1, $2)
    on conflict ("zip")
    do nothing
  `;
  const params = [zip, name];
  db.query(sql, params)
    .then(result => {
      res.sendStatus(201);
    })
    .catch(err => {
      next(err);
    });
});

app.delete('/api/favorites/:zip', (req, res, next) => {
  const zip = req.params.zip;
  const sql = `
    delete
    from "favorites"
    where "zip" = $1
  `;
  const params = [zip];
  db.query(sql, params)
    .then(result => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
});
