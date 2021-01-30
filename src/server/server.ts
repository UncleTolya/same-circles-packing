const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./DataBase');
const bcrypt = require('bcrypt');
const tokenUtils = require('./tokenUtils');
const path = require('path');

const db = new DB();

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
const url = path.join(__dirname, '..', 'build');
server.use(express.static(url));

server.get('/', (req: any, res: any) => {
  res.send('HELLO!');
});

server.post('/checkToken', jsonParser, async ({ body }: any, res: any) => {
  const { token } = body;
  if (token) {
    res.status(200).send(tokenUtils.isValidToken(token));
    return;
  }
  res.status(404).send({ auth: false, msg: 'Пустой токен.' });
});

server.post('/login', jsonParser, async ({ body }: any, res: any) => {
  const user = await db.selectByName(body.name);
  if (!user) {
    res.status(404).send({ auth: false, msg: 'No user found' });
    return;
  }
  await bcrypt.compare(
    body.password,
    user.password,
    (err, isMatch) => {
      if (err) {
        res.status(401).send({ auth: false, msg: 'Неверный пароль.' });
      } else if (isMatch) {
        const token = tokenUtils.createToken(user.id);
        res.status(200).send({ auth: true, user, token });
      }
    },
  );
});

server.post('/register', jsonParser, async ({ body }: any, res: any) => {
  const { name, password } = body;
  const hashedPass = bcrypt.hashSync(password, 10);
  const userFromBase = await db.selectByName(name);
  if (userFromBase) {
    res.status(401).send({ auth: false, msg: `Пользователь ${name} уже существует.` });
    return;
  }
  await db.insert(name, hashedPass).catch(console.log);
  res.status(200).send({ msg: `Пользователь ${name} создан. Перезайдите.` });
});

server.listen(process.env.SERVER_PORT ?? 5000, () => {
  console.log(`Сервер запущен на порту ${process.env.SERVER_PORT ?? 5000}`);
  console.log(`process ${process}`);
});
