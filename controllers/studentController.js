const { validationResult } = require("express-validator");
const student = require("./../models/studentSchema");
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

exports.getAllStudents = (request, response, next) => {
  // if (request.role == "admin") {
  student
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

exports.getStudentById = (request, response, next) => {
  //-----> find by email
  //if (request.role == "student") {
  student
    .findOne({ _id: request.params.id })
    .then((data) => {
      response
        .status(200)
        .json(/*{ data: "getting a student by email", data }*/ data);
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};

exports.addNewStudent = (request, response, next) => {
  errorHandeler(request);
  //if (request.body.role == "student") {
  let encoding = bcrypt.hashSync(request.body.password, saltRounds);

  let object = new student({
    //_id: request.body.id,
    fullname: request.body.fullname,
    password: encoding,
    email: request.body.email,
  });
  object
    .save()
    .then((data) => {
      response.status(201).json({ data: "added student", data });
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};

exports.updateStudent = (request, response, next) => {
  errorHandeler(request);
  //if (request.role == "student") {
  //----> student snly has the right to modefiy himself
  student
    .updateOne(
      { _id: request.params.id }, //-----> get his email from the token of the request
      {
        $set: {
          fullname: request.body.fullname,
          email: request.body.email,
          password: request.body.password,
        },
      }
    )
    .then((data) => {
      if (data == null) throw new Error("student is not found");
      response.status(201).json({ data: "updated student", data });
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};

exports.deleteStudent = (request, response, next) => {
  //if (request.role == "student") {
  student
    .findOneAndDelete({ _id: request.body._id }) //
    .then((data) => {
      if (data == null) throw new Error("student is not found");
      response
        .status(200)
        .json({ data: "specific student is deleted by email", data });
    })
    .catch((error) => {
      next(error);
    });
  // } else {
  //   throw new Error("not authorized");
  // }
};
