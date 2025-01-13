var jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    //read the token from req cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login");
    }

    // validate the token
    var decodded = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodded;

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
}

module.exports = {
  userAuth
}