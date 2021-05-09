// const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const jwt = require("jsonwebtoken");

const { getKey } = require("./routes/api/utils");

// var mongoAtlasUri = `mongodb+srv://${process.env.DB_PASS}@cluster0.98ji6.mongodb.net/testdb?retryWrites=true&w=majority`;
// // var mongoAtlasUri = "mongodb://localhost:27017/test";
// async function test() {
//   try {
//     // Connect to the MongoDB cluster
//     await mongoose.connect(mongoAtlasUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     const MyModel = mongoose.model(
//       "test",
//       new mongoose.Schema({ name: String })
//     );

//     let model = MyModel({ name: "HIHIHIH" });
//     model
//       .save()
//       .then((res) => console.log(res))
//       .catch((err) => console.log(err));
//     // MyModel.find({ _id: "60974290325c9649366e3aa8" }).then((res) =>
//     //   console.log(res)
//     // );
//   } catch (e) {
//     console.log(e);
//   }
// }

// test();

console.log(getKey("30ce927f-4fee-409d-8845-0c5894a8732f"));
console.log(
  jwt.sign(
    {
      credentialKey: "AJBMBGK-8TSMCA2-GJ7JN8F-GD3DG3H",
      containerKeys: ["63794ZZ-9ZQ417F-H12GRP6-JJM76BV"],
      accessorID: "609778d5dc798255cc3a46e0",
    },
    "random_long_long_string"
  )
);
