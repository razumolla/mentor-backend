const express = require('express');
const paymentRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});



module.exports = paymentRouter;