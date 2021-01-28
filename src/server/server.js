var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./DataBase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
server.get('/', (req, res) => {
    res.send('HELLO!');
});
server.post('/login', jsonParser, ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db.selectByName(body.name);
    if (!user) {
        res.status(404).send({ auth: false, msg: 'No user found' });
        console.log('user not found');
        return;
    }
    yield bcrypt.compare(body.password, user.password, (err, isMatch) => {
        if (err) {
            res.status(401).send({ auth: false, msg: 'Incorrect password' });
        }
        else if (isMatch) {
            const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 864000 });
            res.status(200).send({ auth: true, token, user });
        }
    });
}));
server.post('/register', jsonParser, ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(body);
    const hashedPass = bcrypt.hashSync(body.password, 10);
    const user = yield db.insert(body.name, hashedPass);
    const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 864000 });
    res.status(200).send({ auth: true, token, user });
}));
server.listen(4000, () => {
    console.log('ХЭЛЛОУ МИСТЕР');
});
