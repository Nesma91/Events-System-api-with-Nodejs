const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

//build speakerschema
const schema = new mongoose.Schema(
  {
    _id: { type: Number },
    title: { type: "string" },
    eventDate: Date,
    main_speaker: {
      type: String,
      ref: "speakers",
    },
    speakers: [{ type: Number, ref: "speakers" }],
    students: [{ type: Number, ref: "students" }],
  },
  { _id: false }
);

schema.plugin(AutoIncrement, { id: "eventAutoIncrement", inc_field: "_id" });

//register into mongoose
module.exports = mongoose.model("events", schema);
