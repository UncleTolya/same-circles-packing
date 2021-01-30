const jsonwebtoken = require('jsonwebtoken');

const JWT_PRIVACY = process.env.JWT_PRIVACY;

const isValidToken = (token: string): boolean => {
  return jsonwebtoken.verify(token, JWT_PRIVACY);
};

const createToken = (userId: string): JsonWebKey => {
  return jsonwebtoken.sign(
    { id: userId },
    JWT_PRIVACY,
    { expiresIn: 864000 },
  );
};

module.exports = {
  isValidToken,
  createToken,
};
