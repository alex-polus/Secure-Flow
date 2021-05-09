let mongoose = require("mongoose");
const { containerSchema } = require("./containermodel");

//schema
var credentialSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  access_id: {
    type: String,
    required: true,
  },
  containers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Container" }],
    required: true,
  },
});

const Credential = (module.exports = mongoose.model(
  "Credential",
  credentialSchema
));
