const mongoose = require("mongoose");

// 1- speaker schema for validations
const schema = new mongoose.Schema({
  //_id: mongoose.Types.ObjectId, //--> will be automatically stored in db
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: {
    type: String,
    // city: { type: String },
    // street: { type: String },
    // building: { type: Number },
  },
  image: { type: String },
  role: { type: String },
});

// 2- register speaker schema
module.exports = mongoose.model("speakers", schema); //setter and getter
