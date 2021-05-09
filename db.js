var mongoose = require("mongoose");

var mongoAtlasUri =
  "mongodb+srv://mongo:<password>@cluster0.kxpu2.mongodb.net/testdb?retryWrites=true&w=majority";
try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );
} catch (e) {
  console.log("could not connect");
}
