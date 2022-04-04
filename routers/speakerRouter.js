const express = require("express");
const { body, query, param, check } = require("express-validator");
const speakerSchema = require("../models/speakerSchema");
const router = express.Router();
const controller = require("./../controllers/speakerController");
const isAuth = require("./../middleware/authMW");

router
  .route("/speakers")
  .get(isAuth, controller.getAllSpeakers)
  .post(
    [
      body("fullname")
        .isAlphanumeric()
        .withMessage("fullname should be string"),
      body("password")
        .isString()
        .withMessage("Login Password should be string"),
      body("email").isEmail().withMessage("invalid email"),
      body("address").isAlpha().withMessage("user address : obj"),
      body("role")
        .isString()
        .isIn(["speaker", "student"])
        .withMessage("speaker or student"),
      body("image").isString().withMessage("user image : string"),
    ],
    controller.addNewSpeaker
  )
  .delete(isAuth, controller.deleteSpeaker);

router.route("/speakers/:id").get(isAuth, controller.getSpeakerById).put(
  [
    //body("id").isInt().withMessage("put an id number"),--->
    // body("fullname")
    //   .isAlphanumeric()
    //   .withMessage("fullname should be string"),
    // body("password")
    //   .isString()
    //   .withMessage("Lodin Password should be string"),
    // body("email").isEmail().withMessage("invalid email"),
    // body("address").isObject().withMessage("user address : obj"),
    // body("role")
    //   .isString()
    //   .isIn(["speaker", "student"])
    //   .withMessage("speaker or student"),
    // body("image").isString().withMessage("user image : string"),
  ],
  isAuth,
  controller.updateSpeaker
);

module.exports = router;
