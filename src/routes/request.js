const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const sendEmail = require('../utils/sendEmail');


// GET all connection requests
requestRouter.get("/request/all", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const connectionRequests = await ConnectionRequest.find({});
    res.status(200).json(connectionRequests);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

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

    const emailRes = await sendEmail.run(
      "A new friend request from " + req.user.firstName,
      req.user.firstName + " is " + status + " in " + toUser.firstName
    );
    // console.log(emailRes);

    res.status(200).json({
      message: `${req.user.firstName} is ${status} to ${toUser.firstName}`,
      data
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// POST /request/review/:status/:toUserId
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    /*   Sakib 1003 =>  razu 8159
    is loogedUser =toUser- razu?
    status = interested
    requestId should be valid = ab29

      {
        "_id": "67445fe40d3fd5327701ab29", // requestId
        "fromUserId": "673c4d9c1d0403be0d531003", // sakib
        "toUserId": "673dd9e24e4a1fd30d838159", // razu
        "status": "interested",
        "createdAt": "2024-11-25T11:30:45.012Z",
        "updatedAt": "2024-11-25T11:30:45.012Z",
        "__v": 0
      },
    */


    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

    // validate the requestId
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });
    if (!connectionRequest) {
      return res.status(400).json({ message: "Connection Request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({
      message: `Connection request is ${status}`,
      data
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});


module.exports = requestRouter;
