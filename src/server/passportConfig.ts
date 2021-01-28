const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

export interface User {
  id: string;
  name: string;
  password: string;
}

function initialize(passport, db) {
  const autheticateUser = async (
    name: string,
    password: string,
    done: (a: any, b: any, c?: any) => Promise<void>,
  ) => {
    const user = await (db as DataBase).selectByName<User>(name);
    if (!user) {
      return done(null, false, { message: 'User not exists' });
    }
    bcrypt.compare(
      password,
      user.password,
      (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: 'Password is no corrcet' });
      },
    );
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'name',
        passwordField: 'password',
      },
      autheticateUser,
    ),
  );
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
