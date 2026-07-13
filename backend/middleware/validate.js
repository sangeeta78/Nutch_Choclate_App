import { validationResult } from 'express-validator';

/**
 * Collects express-validator errors and returns a 400 with the first message.
 * Place after a chain of validators in a route.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

export default validate;
