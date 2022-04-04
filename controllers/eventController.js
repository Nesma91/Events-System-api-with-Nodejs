const { validationResult } = require("express-validator");
const event = require("./../models/eventSchema");

function errorHandeler(request) {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
}

exports.getAllEvents = (request, response, next) => {
  if (
    request.role == "speaker" ||
    request.role == "student" ||
    request.role == "admin"
  ) {
    event
      .find({})
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("not authorized");
  }
};

exports.getEventById = (request, response, next) => {
  if (request.role == "admin") {
    //----> getting id is a right for admin only
    event
      .findById(request.body.id)
      .then((data) => {
        response.status(200).json({ data: "getting a event by id", data });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("not authorized");
  }
};

exports.addEvent = (request, response, next) => {
  errorHandeler(request);
  if (request.role == "admin") {
    let object = new event({
      //_id: request.body.id,
      title: request.body.title,
      eventDate: request.body.eventDate,
      main_speaker: request.body.main_speaker,
      speakers: request.body.speakers,
      students: request.body.students,
    });
    object
      .save()
      .then((data) => {
        response.status(201).json({ data: "added event", data });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("not authorized");
  }
};

exports.updateEvent = (request, response, next) => {
  errorHandeler(request);
  if (request.role == "admin") {
    event
      .updateOne(
        { title: request.body.title },
        {
          $set: {
            eventDate: request.body.eventDate,
            main_speaker: request.body.main_speaker,
            speakers: request.body.speakers,
            students: request.body.students,
          },
        }
      )
      .then((data) => {
        if (data == null) throw new Error("event is not found");
        response.status(201).json({ data: "updated event", data });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("not authorized");
  }
};

exports.deleteEvent = (request, response, next) => {
  if (request.role == "admin") {
    event
      .findByIdAndDelete(request.body.id)
      .then((data) => {
        if (data == null) throw new Error("event is not found");
        response
          .status(200)
          .json({ data: "specific event is deleted by id", data });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("not authorized");
  }
};
