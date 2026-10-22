const { validationResult } = require("express-validator");
const course = require("../models/course.model");
const httpStatusText = require(".././utils/httpsStatusText");
const asyncHandler = require("../middleware/asyncHandler");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

const getAllCourses = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const totalCourses = await course.countDocuments();
  const totalPages = Math.ceil(totalCourses / limit);

  const courses = await course.find({}, { __v: false }).limit(limit).skip(skip);
  if (courses.length === 0) {
    const error = appError.create(
      "لايوجد كورسات متاحه ",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  return res.json({
    status: httpStatusText.SUCCESS,
    data: { courses },
    pagination: {
      currentPage: page,
      limit,
      totalPages,
      totalItems: totalCourses,
    },
  });
});

// git single course
const getSingleCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  if (!mongoose.isValidObjectId(courseId)) {
    const error = appError.create(
      "Invalid course ID",
      400,
      httpStatusText.FAIL,
    );

    return next(error);
  }

  const newCourse = await course.findById(courseId, { __v: false });
  if (!newCourse) {
    const error = appError.create("course not Found", 404, httpStatusText.FAIL);
    return next(error);
  } else {
    return res.json({
      status: httpStatusText.SUCCESS,
      course: newCourse,
    });
  }
});

const createNewCourse = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  console.log("BODY:", req.body);

  const newCourse = await course.create(req.body);
  const courses = await course.find();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
};

const updateCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  const newCourse = await course.findById(courseId);
  if (!newCourse) {
    const error = appError.create(
      "course not found to update",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  } else {
    const courseUpdated = await course.updateOne(
      { _id: courseId },
      {
        $set: { ...req.body },
      },
    );
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { course: courseUpdated },
    });
  }
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  const forced = await course.findById(courseId);
  if (!forced) {
    const error = appError.create(
      "Course Not Found To Delete",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  } else {
    const data = await course.deleteOne({ _id: courseId });
    return res.status(200).json({ status: "success", data: "null" });
  }
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createNewCourse,
  updateCourse,
  deleteCourse,
};
