const express = require("express");
const { body, query, param, check } = require("express-validator");
const router = express.Router();
const controller = require("./../Controllers/eventController");
const schema = require("../models/eventSchema");
const isAuth = require("./../middleware/authMW");

router
  .route("/events")
  .get(isAuth, controller.getAllEvents)
  .post(
    [
      body("title").isString().withMessage("title : string"),
      body("eventDate").isDate().withMessage("eventDate : date"),
      body("main_speaker").isString().withMessage("main_speaker : string"),
      body("speakers").isArray().withMessage("speakers : array"),
      body("students").isArray().withMessage("students : array"),
    ],
    controller.addEvent
  )
  .put(
    [
      // body("title").isString().withMessage("title : string"),
      // body("eventDate").isInt().withMessage("date : date"),
      // body("mainn_peaker").isString().withMessage("main_speaker : string"),
      // body("speakers").isArray().withMessage("speakers : array"),
      // body("students").isArray().withMessage("students : array"),
    ],
    isAuth,
    controller.updateEvent
  )
  .delete(isAuth, controller.deleteEvent);

router.route("/events/:id").get(isAuth, controller.getEventById);
module.exports = router;
