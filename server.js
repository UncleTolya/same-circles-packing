var _a;
const express = require('express');
const bodyParser = require('body-parser');
// const DB = require('./DataBase');
// const bcrypt = require('bcrypt');
// const tokenUtils = require('./tokenUtils');
// const serveStatic = require('serve-static');
const path = require('path');
// const db = new DB();
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
const url = path.join(__dirname, 'dist');
server.use(express.static(url));
server.get('/', (req, res) => {
    res.send('HELLO!');
});
// server.post('/checkToken', jsonParser, async ({ body }: any, res: any) => {
//   const { token } = body;
//   if (token) {
//     res.status(200).send(tokenUtils.isValidToken(token));
//     return;
//   }
//   res.status(404).send({ auth: false, msg: 'Пустой токен.' });
// });
// server.post('/login', jsonParser, async ({ body }: any, res: any) => {
//   const user = await db.selectByName(body.name);
//   if (!user) {
//     res.status(404).send({ auth: false, msg: 'No user found' });
//     return;
//   }
//   const bodyPass = body.password;
//   const userPassCrypt = user.password;
//   if (await bcrypt.compare(bodyPass, userPassCrypt)) {
//     const token = tokenUtils.createToken(user.id);
//     res.status(200).send({ auth: true, user, token });
//   } else {
//     res.status(401).send({ auth: false, msg: `Неверный пароль. ${bodyPass}; ${userPassCrypt}; ${await bcrypt.hash(bodyPass, 10)}` });
//   }
// });
// server.post('/register', jsonParser, async ({ body }: any, res: any) => {
//   const { name, password } = body;
//   const hashedPass = await bcrypt.hash(password, 10);
//   const userFromBase = await db.selectByName(name);
//   if (userFromBase) {
//     res.status(401).send({ auth: false, msg: `Пользователь ${name} уже существует.` });
//     return;
//   }
//   await db.insert(name, hashedPass).catch(console.log);
//   res.status(200).send({ msg: `Пользователь ${name} создан. Перезайдите.` });
// });
server.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5001, () => {
    var _a;
    console.log(`Сервер запущен на порту ${(_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5001}`);
    console.log(`process ${process}`);
});
