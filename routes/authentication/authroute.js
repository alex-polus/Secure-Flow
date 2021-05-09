const { validateUser } = require("./utils");
const User = require("../../models/usermodel.js");
const util = require("util");
const bcrypt = require("bcrypt");
const Credential = require("../../models/credentialmodel");
const { createKey } = require("../api/utils");

const router = require("express").Router();

router.post("/signin", async (req, res) => {
  let body = req.body;
  if (
    !body.email ||
    body.email == "" ||
    !body.password ||
    body.password == ""
  ) {
    res.status(401).send("must supply a password and email");
    return;
  }
  let { userID } = res.locals;
  let user;
  let hash;

  if (!userID) {
    let email = body.email;
    try {
      user = await User.findOne({ email });
      if (user) {
        hash = user.password;
      } else {
        res.status(500).send("user doesn't have password");
      }
    } catch (e) {
      res.status(500).send(e);
    }
    // get hash from email
  } else {
    // get hash from userID
  }
  try {
    let token = await validateUser(body.password, hash, user.id);
    if (token) {
      res.send({ token });
    } else {
      res.send("incorrect password");
    }
  } catch (e) {
    res.status(500).send("error");
  }
  // get hash from db
});

router.post("/signup", async (req, res) => {
  let body = req.body;
  if (await User.findOne({ email: body.email })) {
    console.log("user already exists");
    return res.send("user already exists");
  }
  bcrypt.hash(body.password, 5, (err, hash) => {
    if (err) {
      res.send(err);
    }
    let newUser = new User({
      name: body.name,
      email: body.email,
      password: hash,
    });

    newUser
      .save()
      .then((user) => {
        let { uuid, apiKey } = createKey();
        let newCred = Credential({
          user_id: user._id,
          access_id: uuid,
          containers: [],
        });
        newCred
          .save()
          .then((data) =>
            res.send(jwt.sign({ userID: user._id }, process.env.secret))
          );
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  });
});

module.exports = router;
