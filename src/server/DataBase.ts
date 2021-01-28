const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const pg = require('pg');

dotenv.config();

const isProduction = process.env.NODE_ENV;

const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_USER}`;

const pool = new pg.Pool({
  connectionString: isProduction
    ? process.env.DATABASE_URL
    : connectionString,
});

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

  public insert(
    name: string = Date.now().toString(),
    pass: string = Date.now().toString(),
  ): void {
    const hashedPass = bcrypt.hashSync(pass, 10);
    const query = `INSERT INTO ${USER_TABLE_NAME} (name, password) VALUES ($1, $2) RETURNING id, name, password;`;
    pool.query(query, [name, hashedPass], (e, res) => {
      if (e) {
        throw e;
      }
      console.log(res.rows);
    });
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
        throw e;
      }
      console.log(res.rows);
    });
  }
}

module.exports = DataBase;
