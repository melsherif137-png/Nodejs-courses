const mongoose = require("mongoose");
const asyncHandler = require("../middleware/asyncHandler");
const conDb = asyncHandler(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("server is connected successfly to data base");
});

module.exports = conDb;
