const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
const User = require("../models/user");

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
    const data = connectionRequests.map(row => {
      if (String(row.fromUserId._id) === String(loggedInUser._id)) {
        return row.toUserId; // If loggedInUser is (fromUserId), return the (toUserId)
      } else {
        return row.fromUserId;  // If loggedInUser is (toUserId), return oposite (fromUserId)
      }
    });

    res.status(200).json({
      message: "Data retrieved successfully",
      data: data
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// @desc      Gets you the profiles of other users on platform
// @route     GET /user/feed
// @access    Private
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // User should see all the user cards except
    // 1. The user who is logged in
    // 2. his connections
    // 3. ignored people
    // 4. already send connection requests

    // example: Razu, Vivek, Rahul, Nikhil, Prashant, Akshay
    // 1. Razu feed = [Vivek, Rahul, Nikhil, Prashant, Akshay]
    // 2. Razu -->Vivek-connection, Razu's feed = [Rahul, Nikhil, Prashant, Akshay]
    // 3. Razu -->Rahul- ignored, Razu's feed = [Vivek, Nikhil, Prashant, Akshay]
    // 4. Razu -->Nikhil, Razu's feed = [Vivek, Rahul, Prashant, Akshay]

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // find all connection requests [send, receved]
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
    }).select("fromUserId toUserId status")

    // set data structure = [A, B ,E, F, G, H] but you can push again A, B ..
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(req => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Data retrieved successfully",
      data: users
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = userRouter;