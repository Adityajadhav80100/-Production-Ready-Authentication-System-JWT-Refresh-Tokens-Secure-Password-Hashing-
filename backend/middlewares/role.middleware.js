export const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    // role comes from JWT (authMiddleware)
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};
