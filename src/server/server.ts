const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./DataBase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db: DataBase = new DB();

const server = express();
const jsonParser = bodyParser.json();

export interface User {
  id: string;
  name: string;
  password: string;
}

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
  const user = await db.selectByName<User>(body.name);
  if (!user) {
    res.status(404).send({ auth: false, msg: 'No user found' });
    console.log('user not found');
    return;
  }
  await bcrypt.compare(
    body.password,
    user.password,
    (err, isMatch) => {
      if (err) {
        res.status(401).send({ auth: false, msg: 'Incorrect password' });
      } else if (isMatch) {
        const token = jwt.sign(
          { id: user.id },
          'supersecret',
          { expiresIn: 864000 },
        );
        res.status(200).send({ auth: true, token, user });
      }
    },
  );
});

server.post('/register', jsonParser, async ({ body }: any, res: any) => {
  console.log(body);
  const hashedPass = bcrypt.hashSync(body.password, 10);
  const user = await db.insert<User>(body.name, hashedPass);
  const token = jwt.sign(
    { id: user.id },
    'supersecret',
    { expiresIn: 864000 },
  );
  res.status(200).send({ auth: true, token, user });
});

server.listen(4000, () => {
  console.log('ХЭЛЛОУ МИСТЕР');
});
