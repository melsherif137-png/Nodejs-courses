const mongoose = require("mongoose");

const coursesSchema = mongoose.Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
});
module.exports = mongoose.model("course", coursesSchema);
