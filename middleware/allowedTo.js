const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStatusText");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = appError.create(
        "this user cannt do this opreations",
        401,
        httpsStatusText.FAIL,
      );
      return next(error);
    }
    next();
  };
};
