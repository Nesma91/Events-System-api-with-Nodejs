// const mongoose = require("mongoose");
// // const autoIncrement = require("mongoose-auto-increment"); //must be changed
// //autoIncrement.initialize(mongoose.connection);
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// //student schema for validations
// const schema = new mongoose.Schema({
//   _id: { type: Number },
//   fullname: { type: String, required: true },
//   password: { type: String, required: true, bcrypt: true },
//   email: { type: String, required: true, unique: true },
// });
// //schema.plugin(autoIncrement.plugin, { model: "students" });
// schema.plugin(AutoIncrement, {
//   id: "student_counter",
//   inc_field: "_id",
// });

// schema.plugin(require("mongoose-bcrypt"));

// module.exports = mongoose.model("students", schema); //setter and getter

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

//build speakerschema
const schema = new mongoose.Schema({
  _id: { type: Number },
  fullname: { type: "string", required: true },
  email: { type: "string", required: true },
  password: { type: "string", required: true },
});
//auto increment
schema.plugin(AutoIncrement, { inc_field: "_id" });
//schema.plugin(require("mongoose-bcrypt"));

//register into mongoose
module.exports = mongoose.model("students", schema);
