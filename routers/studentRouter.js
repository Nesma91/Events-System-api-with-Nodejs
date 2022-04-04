const express = require("express");
const { body, query, param, check } = require("express-validator");
const studentSchema = require("../models/studentSchema");
const router = express.Router();
const controller = require("./../controllers/studentController");
const isAuth = require("./../middleware/authMW");

router
  .route("/students")
  .get(isAuth, controller.getAllStudents)
  .post(
    [
      //body("id").isInt().withMessage("id should be a number"),
      body("fullname")
        .isAlphanumeric()
        .withMessage("fullname should be string"),
      body("password")
        .isString()
        .withMessage("Lodin Password should be string"),
      body("email").isEmail().withMessage("invalid email"),
    ],
    controller.addNewStudent
  )

  .delete(isAuth, controller.deleteStudent);

router.route("/students/:id").get(/*isAuth,*/ controller.getStudentById).put(
  [
    // body("fullname")
    //   .isAlphanumeric()
    //   .withMessage("fullname should be string"),
    // body("password")
    //   .isString()
    //   .withMessage("Lodin Password should be string"),
    // body("email").isEmail().withMessage("invalid email"),
  ],
  isAuth,
  controller.updateStudent
);

module.exports = router;
