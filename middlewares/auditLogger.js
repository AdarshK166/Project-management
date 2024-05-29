const AuditLog = require("../models/auditlog");

const logAction = (action, entity, entityId) => {
  return async (req, res, next) => {
    const { id: userId } = req.user;
    await AuditLog.create({
      user_id: userId,
      action,
      entity,
      entity_id: entityId,
      timestamp: new Date(),
    });
    next();
  };
};

module.exports = logAction;
