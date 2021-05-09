let mongoose = require("mongoose");

//schema
var accessorSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

exports.accessorSchema = accessorSchema;

const Accessor = (module.exports = mongoose.model("Accessor", accessorSchema));
