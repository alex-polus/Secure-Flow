let mongoose = require("mongoose");
const { accessorSchema } = require("./accessormodel");

//schema
var containerSchema = mongoose.Schema({
  access_id: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  accessors: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accessor" }],
    required: true,
  },
  askers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accessor" }],
    required: true,
  },
});

exports.containerSchema = containerSchema;
const Container = (module.exports = mongoose.model(
  "Container",
  containerSchema
));
