const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return res.status(400).json({
    error: 'Validation failed',
    details: result.array()
  });
};

module.exports = {
  handleValidation
};
