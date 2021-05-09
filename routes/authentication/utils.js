const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.validateUser = (password, hash, userID) => {
  return new Promise((res, rej) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        rej(err);
      } else {
        // user verified
        // get userID
        let token = jwt.sign({ userID }, process.env.secret, {
          expiresIn: "5h",
        });
        res(token);
      }
    });
  });
};
