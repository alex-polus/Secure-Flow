const express = require("express");
const router = express.Router();
const Credential = require("../../models/credentialmodel");
const Container = require("../../models/containermodel");
const { createKey, getValue } = require("./utils");
const { route } = require("../authentication/authroute");
const Accessor = require("../../models/accessormodel");
const { sendNotif } = require("../../courier/courier");
const User = require("../../models/usermodel");

router.post("/create", async (req, res) => {
  let body = req.body;
  let data;
  //basic checks
  if (typeof body.data == "object") {
    data = body.data;
  } else {
    data = {};
  }
  if (!body.desc) {
    return res
      .status(401)
      .send("you must supply a description to the new data container");
  }
  if (!body.name || !body.email) {
    return res
      .status(401)
      .send(
        "To access this data, you must provide an email and name of your company"
      );
  }

  //check if access enabled
  let { credentialKey, containerKeys } = res.locals;
  if (!credentialKey) {
    res.status(401).send("access not authorized");
  } else {
    let credential;
    try {
      credential = await Credential.findOne({
        access_id: credentialKey,
      });
    } catch (e) {
      return res.status(500).send(e);
    }
    //   user notification
    let { uuid, apiKey } = createKey();
    let newAccessor = Accessor({ name: body.name, email: body.email });
    newAccessor
      .save()
      .then((accessor) => {
        let newContainer = Container({
          access_id: uuid,
          desc: body.desc,
          data,
          accessors: [accessor._id],
          askers: [],
        });
        newContainer
          .save()
          .then((container) =>
            credential.update({ $push: { containers: container._id } })
          )
          .then(() => res.send(newContainer))
          .catch((err) => res.status(500).send("couldn't update credential"));
      })
      .catch((err) =>
        res.status(500).send("couldn't create accessor document")
      );
  }
});

router.get("/viewCredential", (req, res) => {
  let { userID, credentialKey } = res.locals;

  if (!userID && !credentialKey) {
    res.status(401).send("access not authorized");
  } else {
    let identifier = userID
      ? { user_id: userID }
      : { access_id: credentialKey };
    Credential.findOne(identifier)
      .populate({
        path: "containers",
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: "accessors" },
      })
      .exec((err, credential) => {
        if (err) {
          res.status(500).send("error");
        }
        let result = [];
        for (let container of credential.containers) {
          if (userID) {
            result.push({
              id: container._id,
              data: container.data,
              desc: container.desc,
              accessors: container.accessors,
            });
          } else {
            result.push({ desc: container.desc });
          }
        }
        res.json(result);
      });
  }
});

router.get("/container", (req, res) => {
  let { userID, credentialKey, containerKeys, accessorID } = res.locals;
  let body = req.body;
  // request access
  Container.find({
    access_id: {
      $in: containerKeys,
    },
  })
    .populate({ path: "accessors" })
    .exec((err, docs) => {
      if (err) {
        console.log(err);
      }

      // gets all docs. Filters them down based on whether accessorID exists in our accessors. We access available accessorIDs using accessors.map(v => v._id)
      docs = docs
        .filter((v) => v.accessors.map((v) => v._id).includes(accessorID))
        .map((v) => ({
          desc: v.desc,
          data: v.data,
          accessors: v.accessors,
        }));
      res.json(docs);
    });
});

router.post("/container", (req, res) => {
  let { userID, credentialKey, containerKeys, accessorID } = res.locals;
  let body = req.body;
  let { datas } = body;
  if (datas.length != containerKeys.length) {
    res
      .status(500)
      .send("There must be the same number of datas and container keys!");
  }
  for (let i = 0; i < containerKeys.length; i++) {
    const containerKey = containerKeys[i];
    const data = datas[i];
    Container.findOne({ access_id: containerKey }, (err, container) => {
      if (err) {
        res.status(500).send(err);
      }
      if (container.accessors.map((v) => v._id).includes(accessorID)) {
        container.set("data", { ...container.data, ...data });
      }
      res.send(container);
    });
  }
});

router.post("/revoke", (req, res) => {
  let { userID } = res.locals;
  let { accessorID, containerID } = req.body;
  if (!userID) {
    return res.status(500).send("must be signed in");
  }

  if (!accessorID) {
    return res.send("must have at least one service to revoke");
  }

  Container.findById(containerID, (err, container) => {
    if (err) {
      return res.status(500).send(err);
    }
    container.set({
      accessors: container.accessors.filter((v) => v._id != accessorID),
    });
    res.send(container);
  });
});

router.post("/getApproval", async (req, res) => {
  let { credentialKey, containerKeys, accessorID } = res.locals;

  let { name, email } = req.body;
  Credential.findOne({ access_id: credentialKey }, (err, credential) => {
    if (err) {
      return res.status(500).send(err);
    }
    let { user_id } = credential;
    User.findById(user_id, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      Container.find(
        {
          access_id: {
            $in: containerKeys,
          },
        },
        async (err, containers) => {
          if (err) {
            return res.status(500).send(err);
          }
          if (!accessorID) {
            if (!name || !email) {
              return res
                .status(500)
                .send("must have name and email to request access");
            }
            let accessor = Accessor({ name, email });
            accessorID = await accessor.save()._id;
          }
          for (let container of containers) {
            container.update({ $push: { askers: container._id } });
          }
          sendNotif(
            `${name} is requesting access to the following containers: \n ${containers
              .map((v) => v._id)
              .join("\n")}`,
            user.email
          ).then((data) => res.send("requested access"));
        }
      ).catch((e) => console.log(e));
      // send notification to user
    });
  });
});

// router.post();

module.exports = router;
