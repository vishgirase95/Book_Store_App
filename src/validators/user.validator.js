import Joi from '@hapi/joi';

export const newUserValidator = (req, res, next) => {
  const schema = Joi.object({
    FirstName: Joi.string().min(3).required(),
    LastName: Joi.string().min(4).required(),
    Email: Joi.string().email().min(4).required(),
    Password: Joi.string().min(4).required(),
    Role: Joi.string(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    next(error);
  } else {
    req.validatedBody = value;
    next();
  }
};
