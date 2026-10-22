const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStatusText");

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    const error = appError.create(
      "token is require",
      401,
      httpsStatusText.FAIL,
    );
    return next(error);
  }
  const token = authHeader.split(" ")[1];
  const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.currentUser = currentUser;
  next();
});

module.exports = verifyToken;
