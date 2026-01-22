const { AuditLog } = require('../models');
const logger = require('../utils/logger');

const createAuditLog = async (userId, action, entityType, entityId, oldValues, newValues, req) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      oldValues: oldValues || null,
      newValues: newValues || null,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    logger.error('Failed to create audit log:', error);
  }
};

const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.userId) {
        const entityId = data?.data?.id || req.params?.id;
        createAuditLog(
          req.userId,
          action,
          entityType,
          entityId,
          req.originalData,
          data?.data,
          req
        );
      }
      originalJson(data);
    };
    
    next();
  };
};

module.exports = { auditLog, createAuditLog };