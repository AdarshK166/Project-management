const Joi = require("joi");

const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().valid("Planned", "InProgress", "Completed").required(),
  project_manager_id: Joi.number().integer().required(),
  client_id: Joi.number().integer().required(),
});

const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateProject;
