const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log("sending the connection request to user");

    res.send(user.firstName + " " + "Sent the Connection Request ");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = requestRouter;
