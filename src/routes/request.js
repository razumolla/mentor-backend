const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

// POST /request/send/:status/:toUserId
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid Status");
    }

    // validate the toUserId
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error("User not found");
    }

    // if there is an existing connection request, then throw an error
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ],

    });
    if (existingConnectionRequest) {
      throw new Error("Connection Request already exists");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });
    const data = await connectionRequest.save();

    res.status(200).json({
      message: "Connection Request Sent Successfully",
      data
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = requestRouter;
