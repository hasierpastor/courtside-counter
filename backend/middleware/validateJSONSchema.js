const { validate } = require('jsonschema');

function validateJSONSchema(jsonSchema) {
  return function(req, res, next) {
    const result = validate(req.body, jsonSchema);
    if (!result.valid) {
      next(result.errors.map(error => error.stack));
    }
    next();
  };
}

module.exports = validateJSONSchema;
