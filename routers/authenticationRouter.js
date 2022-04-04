const express = require("express");
const { body, query, param } = require("express-validator");
const router = express.Router();
const controller = require("./../controllers/authenticationController");
const speaker = require("./../models/speakerSchema");
const isAuth = require("./../middleware/authMW");

router.post(
  "/login",
  [
    body("role").isString().isIn(["admin", "speaker", "student"]),
    body("fullname").isAlpha().withMessage("Login fullname should be String"),
    body("password").isString().withMessage("Lodin Password should be string"),
    body("email").isEmail().withMessage("invalid email"),
  ],
  controller.checkingAuthentication
);

router.post(
  "/register",
  [
    body("isSpeaker").isBoolean().withMessage("be boolean"),
    body("fullname").isAlpha().withMessage("fullname should be String"),
    body("password")
      .isString()
      .withMessage("resgister Password should be string"),
    body("email")
      .isEmail()
      .custom((value) => {
        return speaker.findOne({ email: value }).then((speaker) => {
          if (speaker) {
            return Promise.reject("E-mail already in use");
          }
        });
      })
      .withMessage("E-mail already in use"),
    body("address")
      .if(body("isSpeaker").equals("true"))
      .bail()
      .isString()
      .withMessage("user address : string"),
    // body("address.city")
    //   .if(body("isSpeaker").equals("true"))
    //   .bail()
    //   .isAlpha()
    //   .withMessage("city should be String"),
    // body("address.street")
    //   .if(body("isSpeaker").equals("true"))
    //   .bail()
    //   .isAlpha()
    //   .withMessage("street should be String"),
    // body("address.building")
    //   .if(body("isSpeaker").equals("true"))
    //   .bail()
    //   .isNumeric()
    //   .withMessage("building should be String"),
    body("image").optional().isString().withMessage("image should be String"),
    body("role")
      .if(body("isSpeaker").equals("true"))
      .bail()
      .isString()
      .isIn(["speaker", "student"])
      .withMessage("speaker or student"),
  ],
  controller.createUser
);

//update password
router.put(
  "/update",
  [
    body("password").isString().withMessage("password: string"),
    body("confirm")
      .isString()
      .custom((value, { req }) => {
        //console.log(req.body.password)
        if (value !== req.body.password) {
          throw new Error("confirmation is not correct");
        } else {
          return true;
        }
      }),
    body("email").isString().withMessage("not allowed"),
    body("role")
      .isString()
      .isIn(["speaker", "student"])
      .withMessage("role: string"),
  ],
  /*isAuth,*/
  controller.updateAccount
);

module.exports = router;
