const express = require("express");
const Router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");

// setting of storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});
const fileFilter = function (req, file, cb) {
  const fileType = file.mimetype.split("/")[0];
  if (fileType == "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file type must be an image", 400), false);
  }
};

const upload = multer({ storage, fileFilter });
const usersController = require("../controller/users.controller");
const appError = require("../utils/appError");

Router.get("/", verifyToken, usersController.getAllUsers);
Router.delete("/", usersController.deleteAllUsers);
Router.post("/register", upload.single("avatar"), usersController.register);
Router.post("/login", usersController.login);
module.exports = Router;
