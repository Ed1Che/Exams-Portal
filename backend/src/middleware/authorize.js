const { ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      logger.warn(`Unauthorized access attempt by user ${req.userId} with role ${req.userRole}`);
      return res.status(403).json({ 
        success: false,
        error: 'Access forbidden - insufficient permissions' 
      });
    }

    next();
  };
};

module.exports = authorize;