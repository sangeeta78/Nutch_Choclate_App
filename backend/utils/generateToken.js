import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for the given user id.
 * @param {string} id - Mongo ObjectId of the user
 * @returns {string} signed JWT
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

export default generateToken;
