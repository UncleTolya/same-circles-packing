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
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
function initialize(passport, db) {
    const autheticateUser = (name, password, done) => __awaiter(this, void 0, void 0, function* () {
        const user = yield db.selectByName(name);
        if (!user) {
            return done(null, false, { message: 'User not exists' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, { message: 'Password is no corrcet' });
        });
    });
    passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password',
    }, autheticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        const user = db.selectById(id);
        if (!user) {
            throw new Error();
        }
        done(null, user);
    });
}
module.exports = initialize;
