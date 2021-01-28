const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const DB = require('./DataBase');

// const initializePassport = require('./passportConfig');

const db: DataBase = new DB();

// initializePassport(passport, db);

const server = express();
const jsonParser = bodyParser.json();

// CORS middleware
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};

server.use(allowCrossDomain);

server.get('/', (req: any, res: any) => {
  res.send('HELLO!');
});

server.post('/login', jsonParser, async ({ body }: any, res: any) => {
  const user = await db.selectByName<object>(body.name);
  res.send(user);
});

server.get('/regiset', (req: any, res: any) => {
  db.insert();
});

server.listen(4000, () => {
  console.log('ХЭЛЛОУ МИСТЕР');
});
