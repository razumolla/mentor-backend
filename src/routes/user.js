const express = require('express');
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

// @desc      Get all the connection requests received by the user
// @route     GET /api/v1/user/requests/received
// @access    Private
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    // .populate("toUserId"); // Over fetching data - that is unnecessary

    res.status(200).json({
      message: "Data retrieved successfully",
      data: connectionRequests
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = userRouter;