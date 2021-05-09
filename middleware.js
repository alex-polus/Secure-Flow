const jwt = require("jsonwebtoken");
const { getValue } = require("./routes/api/utils");

exports.tokenMiddleware = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.match(/(?<=Bearer ).+(?=\b)/);
    if (token) {
      let { payload, signature } = jwt.decode(token.join(""), {
        complete: true,
      });
      console.log(payload);
      if (
        payload.userID &&
        (payload.credential || payload.containerKeys || payload.accessorID)
      ) {
        return res
          .status(401)
          .send("Must either send a credential key or user auth. Not both");
      } else {
        if (payload.userID) {
          res.locals = payload;
        } else {
          res.locals = {
            credentialKey: getValue(payload.credentialKey),
            containerKeys: payload.containerKeys
              ? payload.containerKeys.map((key) => getValue(key))
              : [],
            accessorID: payload.accessorID,
          };
        }
      }
    }
  }
  next();
};
