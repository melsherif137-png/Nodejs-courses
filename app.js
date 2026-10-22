require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const httpStatusText = require("./utils/httpsStatusText");
const conDb = require("./config/db");
const appError = require("./utils/appError");
const path = require("node:path");

const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

// connection to  database
conDb();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// to access frontend to fetch data from my backend
app.use(cors());

// to can my project read and body income
app.use(express.json());

// any route first from this go to this route
app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

// global error in any Route not found
app.use((req, res, next) => {
  const error = appError.create(
    "this page is not found",
    404,
    httpStatusText.ERROR,
  );

  next(error);
});

// globel error in any Route
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: "null",
  });
});

// run server
app.listen(process.env.PORT, "localhost", () => {
  console.log("hello from Node js");
});
