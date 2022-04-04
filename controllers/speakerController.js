const { validationResult } = require("express-validator");
const speaker = require("./../models/speakerSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

exports.getAllSpeakers = (request, response, next) => {
  //if (request.role == "admin") {
  speaker
    .find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};

exports.getSpeakerById = (request, response, next) => {
  //if (request.role == "speaker") {
  speaker
    .findOne({ _id: request.params.id })
    .then((data) => {
      response
        .status(200)
        .json({ /*data: "getting a speaker by email",*/ data });
    })
    .catch((error) => {
      next(error);
    });
  //}
};

exports.addNewSpeaker = (request, response, next) => {
  //errorHandeler(request);
  //console.log(request.body);
  //response.json({ body: request.body, file: request.file });
  //if (request.body.role == "speaker") {
  let encoding = bcrypt.hashSync(request.body.password, saltRounds);
  let object = new speaker({
    fullname: request.body.fullname,
    password: encoding,
    email: request.body.email,
    address: request.body.address,
    image: "http://localhost:8080/images/" + request.file.filename, //request.body.image,
    role: request.body.role,
  });
  object
    .save()
    .then((data) => {
      response.status(201).json({ data: "added speaker", data });
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};

exports.updateSpeaker = (request, response, next) => {
  //errorHandeler(request);
  //if (request.role == "speaker") {
  speaker
    .updateOne(
      { _id: request.params.id },
      {
        $set: {
          fullname: request.body.fullname,
          email: request.body.email,
          password: request.body.password, //encoding,
          address: request.body.address,
          image: "http://localhost:8080/images/" + request.body.image,
          role: request.body.role,
        },
      }
    )
    .then((data) => {
      if (data == null) throw new Error("speaker is not found");
      response.status(201).json({ /*data: "updated speaker",*/ data });
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};

exports.deleteSpeaker = (request, response, next) => {
  //if (request.role == "speaker") {
  speaker
    .findOneAndDelete({ _id: request.body._id })
    .then((data) => {
      if (data == null) throw new Error("speaker is not found");
      response
        .status(200)
        .json({ data: "specific speaker is deleted by email", data });
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};
