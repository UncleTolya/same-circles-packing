const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

const isProduction = process.env.NODE_ENV;

// const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString,
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

  public async selectByName<T>(name: string): Promise<T> {
    const query = `SELECT * FROM ${USER_TABLE_NAME} WHERE name = $1;`;
    const resp = await pool.query(query, [name]);
    return resp.rows[0] as T;
  }

  public async selectById<T>(id: string): Promise<T> {
    const query = `SELECT * FROM ${USER_TABLE_NAME} WHERE id = $1;`;
    const resp = await pool.query(query, [id]);
    return resp.rows[0] as T;
  }

  public async insert<T>(
    name: string,
    pass: string,
  ): Promise<T> {
    const query = `INSERT INTO ${USER_TABLE_NAME} (name, password) VALUES ($1, $2) RETURNING id, name, password;`;
    const resp = await pool.query(query, [name, pass]);
    return resp.rows[0] as T;
  }

  private createUserTable(): void {
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
