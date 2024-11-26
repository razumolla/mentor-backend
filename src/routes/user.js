const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

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
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    // .populate("toUserId"); // Over fetching data - that is unnecessary

    res.status(200).json({
      message: "Data retrieved successfully",
      data: connectionRequests
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// @desc       Find all my connection people
// route      Get /user/connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // loggedINUser can be fromUserId or toUserId
    // so we need to check if the loggedInUser is fromUserId or toUserId
    // and then populate the user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" }
      ]
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // Extract connections based on whether the logged-in user is the sender or receiver
    const connections = connectionRequests.map(row => {
      if (String(row.fromUserId._id) === String(loggedInUser._id)) {
        return row.toUserId; // If loggedInUser is (fromUserId), return the (toUserId)
      } else {
        return row.fromUserId;  // If loggedInUser is (toUserId), return oposite (fromUserId)
      }
    });

    res.status(200).json({
      message: "Data retrieved successfully",
      data: connections
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = userRouter;