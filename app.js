require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const authenticationRouter = require("./routers/authenticationRouter");
const speakerRouter = require("./routers/speakerRouter");
const studentRouter = require("./routers/studentRouter");
const eventRouter = require("./routers/eventRouter");

//image variables
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //console.log(path.join(__dirname, "images"));
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toLocaleDateString().replace(/\//g, "-") +
        "-" +
        file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  )
    cb(null, true);
  else cb(null, false);
};

//create server
const app = express();

mongoose
  .connect(process.env.Databaseurl)
  .then(() => {
    console.log("DB connected ......");
    //listen on port number
    app.listen(process.env.portnumber, () => {
      console.log(process.env.NODE_MODE);
      console.log("I am Listening .......");
    });
  })
  .catch((error) => {
    console.log("DB Problem");
  });
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage, fileFilter }).single("image"));
app.use(morgan("tiny"));
app.use(cors());

//first middleware
app.use(morgan(":method :url :status "));

//cross-domain-control
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PUT,OPTIONS"
  );
  response.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//second middleware
// app.use((request, response, next) => {
//   if (true) {
//     console.log("authorized");
//     next();
//   } else {
//     console.log("Not Authorized");
//     next(new Error("Not Authorized"));
//   }
// });

//parsing
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

////////routers (End Points)
app.use(authenticationRouter);
app.use(speakerRouter);
app.use(studentRouter);
app.use(eventRouter);

//not found middleware
app.use((request, response) => {
  response.status(404).json({ data: "Not Found" });
});

//one error middleware
app.use((error, request, response, next) => {
  let status = error.status || 500;
  response.status(status).json({ Error: error + "" });
});
