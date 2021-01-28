"use strict";
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
const passport = require('passport');
const DB = require('./DataBase');
// const initializePassport = require('./passportConfig');
const db = new DB();
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
server.get('/', (req, res) => {
    res.send('HELLO!');
});
server.post('/login', jsonParser, ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db.selectByName(body.name);
    res.send(user);
}));
server.get('/regiset', (req, res) => {
    db.insert();
});
server.listen(4000, () => {
    console.log('ХЭЛЛОУ МИСТЕР');
});
