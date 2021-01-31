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
const dotenv = require('dotenv');
const pg = require('pg');
dotenv.config();
const isProduction = process.env.NODE_ENV;
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
// const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({
    connectionString: isProduction
        ? process.env.DATABASE_URL
        : connectionString,
});
// const pool = new pg.Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
const USER_TABLE_NAME = 'users';
// eslint-disable-next-line import/prefer-default-export
class DataBase {
    constructor() {
        this.createUserTable();
    }
    selectByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM ${USER_TABLE_NAME} WHERE name = $1;`;
            const resp = yield pool.query(query, [name]);
            return resp.rows[0];
        });
    }
    selectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM ${USER_TABLE_NAME} WHERE id = $1;`;
            const resp = yield pool.query(query, [id]);
            return resp.rows[0];
        });
    }
    insert(name, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO ${USER_TABLE_NAME} (name, password) VALUES ($1, $2) RETURNING id, name, password;`;
            const resp = yield pool.query(query, [name, pass]);
            return resp.rows[0];
        });
    }
    createUserTable() {
        const query = `CREATE TABLE IF NOT EXISTS ${USER_TABLE_NAME} (
      id BIGSERIAL PRIMARY KEY NOT NULL,
      name VARCHAR(200) NOT NULL,
      password VARCHAR(200) NOT NULL,
      UNIQUE(name)
    );`;
        pool.query(query, (e, res) => {
            if (e) {
                console.log(connectionString);
                throw e;
            }
            console.log(`Table ${USER_TABLE_NAME} was created.`);
        });
    }
}
module.exports = DataBase;
