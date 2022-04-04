const { validationResult } = require("express-validator");
const speaker = require("./../models/speakerSchema");
const student = require("./../models/studentSchema");
const bcrypt = require("bcrypt");
const students = require("./../controllers/studentController");
const jwt = require("jsonwebtoken");

exports.checkingAuthentication = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  } else {
    speaker
      .findOne({ email: request.body.email })
      .then((data) => {
        if (data == null) {
          student
            .findOne({ email: request.body.email })
            .then((data) => {
              if (data == null) {
                throw new Error("no permission to login");
              } else {
                let matchingPassword = async function checkUser(
                  fullname,
                  password
                ) {
                  const match = await bcrypt.compare(
                    request.body.password,
                    data.password
                  );
                  if (match) {
                    let token = jwt.sign(
                      {
                        email: request.body.email,
                        role: "student",
                      },
                      process.env.secretkey,
                      { expiresIn: "1h" }
                    );
                    response
                      .status(201)
                      .json({ data: "logged in successfully", data, token });
                  } else {
                    //throw new Error(" password is wrong");
                    next(new Error(" password is wrong"));
                  }
                };
                matchingPassword();
              }
            })
            .catch((error) => {
              next(error);
            });
        } else {
          let matchingPassword = async function checkUser(fullname, password) {
            const match = await bcrypt.compare(
              request.body.password,
              data.password
            );
            if (match) {
              let token = jwt.sign(
                {
                  email: request.body.email,
                  role: "speaker",
                },
                process.env.secretkey,
                { expiresIn: "1h" }
              );
              response
                .status(201)
                .json({ data: "logged in successfully", data, token });
            } else {
              //throw new Error(" password is wrong");
              next(new Error(" password is wronggggggg"));
            }
          };
          matchingPassword();
        }
      })
      .catch((error) => {
        next(error);
      });
  }
  // speaker
  //   .findOne({ email: request.body.email })
  //   .then((data) => {
  //     if (data == null) {
  //       throw new Error("no permission to login");
  //     } else {
  //       let matchingPassword = async function checkUser(fullname, password) {
  //         const match = await bcrypt.compare(
  //           request.body.password,
  //           data.password
  //         );
  //         if (match) {
  //           response.status(201).json({ data: "logged in successfully", data });
  //         } else {
  //           //throw new Error(" password is wrong");
  //           next(new Error(" password is wrong"));
  //         }
  //       };
  //       matchingPassword();
  //     }
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });
};

exports.createUser = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  } else {
    if (request.body.isSpeaker == true) {
      response.redirect(307, "/speakers");
    } else if (request.body.isSpeaker == false) {
      response.redirect(307, "/students");
    }
  }

  // response.status(201).json({ data: "added", BODY: request.body });
};

//update account
exports.updateAccount = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  } else {
    updatecheck(request, response, next);
  }
};

//role checking fn
function updatecheck(request, response, next) {
  if (request.body.role == "speaker") {
    updatePassword(speakers, request, response, next);
  } else {
    updatePassword(students, request, response, next);
  }
}

//update password fn
function updatePassword(users, request, response, next) {
  users
    .findOneAndUpdate(
      { email: request.body.email },
      {
        $set: {
          password: request.body.password,
        },
      }
    )
    .then((data) => {
      if (data !== null) {
        response.status(200).json({ data: "updated", data });
      } else {
        next("not authorized");
      }
    })
    .catch((error) => next(error));
}
