// Middleware to check user role
module.exports = function(requiredRoles) {
  return (req, res, next) => {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};
