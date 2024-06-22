const { Schema, model, Types } = require("mongoose");

const volcanoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  elevation: {
    type: Number,
    required: true,
  },
  lastEruption: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  typeVolcano: {
    type: [String],
    enum: {
      values: [
        "Supervolcanoes",
        "Submarine",
        "Subglacial",
        "Mud",
        "Stratovolcanoes",
        "Shield",
      ],
      message: "Type of volcano not accepted, you provided {VALUE}",
    },
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  voteList: {
    type: [Types.ObjectId],
    ref: "User",
    default: [],
  },
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Volcano = model("Volcano", volcanoSchema);

module.exports = { Volcano };
