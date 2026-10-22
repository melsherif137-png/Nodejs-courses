const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const courseController = require("../controller/courses.controller");
const verifyJWT = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");
router.get("/", verifyJWT, courseController.getAllCourses);

router.get("/:courseId", courseController.getSingleCourse);

router.post(
  "/",
  [
    body("title")
      .notEmpty()
      .withMessage("title is require")
      .bail()
      .isLength({ min: 5 })
      .withMessage("at least 2 char"),
    body("price").notEmpty().withMessage("price is require").bail(),
  ],
  courseController.createNewCourse,
);

router.patch(
  "/:courseId",
  verifyJWT,
  allowedTo(userRoles.ADMIN),
  courseController.updateCourse,
);

router.delete(
  "/:courseId",
  verifyJWT,
  allowedTo(userRoles.ADMIN),
  courseController.deleteCourse,
);
module.exports = router;
