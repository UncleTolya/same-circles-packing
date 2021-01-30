var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./DataBase');
const bcrypt = require('bcrypt');
const tokenUtils = require('../server/tokenUtils');
const path = require('path');
const serveStatic = require('serve-static');
const db = new DB();
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
server.use(serveStatic(__dirname + '/dist'));
server.get('/', (req, res) => {
    res.send('HELLO!');
});
server.post('/checkToken', jsonParser, ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = body;
    if (token) {
        res.status(200).send(tokenUtils.isValidToken(token));
        return;
    }
    res.status(404).send({ auth: false, msg: 'Пустой токен.' });
}));
server.post('/login', jsonParser, ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db.selectByName(body.name);
    if (!user) {
        res.status(404).send({ auth: false, msg: 'No user found' });
        return;
    }
    yield bcrypt.compare(body.password, user.password, (err, isMatch) => {
        if (err) {
            res.status(401).send({ auth: false, msg: 'Неверный пароль.' });
        }
        else if (isMatch) {
            const token = tokenUtils.createToken(user.id);
            res.status(200).send({ auth: true, user, token });
        }
    });
}));
server.post('/register', jsonParser, ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = body;
    const hashedPass = bcrypt.hashSync(password, 10);
    const userFromBase = yield db.selectByName(name);
    if (userFromBase) {
        res.status(401).send({ auth: false, msg: `Пользователь ${name} уже существует.` });
        return;
    }
    yield db.insert(name, hashedPass).catch(console.log);
    res.status(200).send({ msg: `Пользователь ${name} создан. Перезайдите.` });
}));
server.listen((_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : 5000, () => {
    var _a;
    console.log(`Сервер запущен на порту ${(_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : 5000}`);
    console.log(`process ${process}`);
});
