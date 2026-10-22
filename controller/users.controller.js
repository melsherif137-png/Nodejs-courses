const asyncHandler = require("../middleware/asyncHandler");
const user = require("../models/user.model");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpsStatusText");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await user
    .find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  if (users.length === 0) {
    const error = appError.create(
      "لايوجد مستخدمين  ",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  return res.json({
    status: httpStatusText.SUCCESS,
    data: { users },
  });
});

const deleteAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.deleteMany({});

  if (users.deletedCount === 0) {
    const error = appError.create("لا يوجد مستخدمين", 404, httpStatusText.FAIL);
    return next(error);
  }

  return res.json({
    status: httpStatusText.SUCCESS,
    data: { deletedCount: users.deletedCount },
  });
});

const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user is already register",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  const hasedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hasedPassword,
    role,
  });

  // generate JWT toked
  const token = generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();
  const resUser = await User.findById(newUser._id).select("-__v -password");
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { users: resUser } });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = appError.create(
      "email and password are require",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create(
      "user is not found",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    const error = appError.create(
      " password is not true",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  if (user && matchedPassword) {
    const token = generateJWT({
      user: user.email,
      id: user._id,
      role: user.role,
    });
    return res.status(200).json({ token });
  } else {
    const error = appError.create(
      "something is error",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
  deleteAllUsers,
};
