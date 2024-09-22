const authMiddleware = (req, res, next) => {
  const user = req.session;
  if (user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
