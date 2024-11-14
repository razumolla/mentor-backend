const express = require('express');

const app = express();
const PORT = 3000;

const { adminAuth, userAuth } = require('./middlewares/auth');

// handle Auth middleware for all requests: post, get, put, delete
app.use("/admin", adminAuth)

app.get("/admin/allData", (req, res, next) => {
  res.send("All Data send");
});
app.get("/user/login", (req, res, next) => {
  res.send("User Data send");
});

app.get("/user", userAuth, (req, res, next) => {
  res.send("User Data send");
});



app.get("/admin/allData", (req, res, next) => {
  // logic of checking user, if the request is authenticated, then only proceed
  const token = req.headers.authorization;
  if (token) {
    // if token is valid, then proceed
    res.send("All Data send");
  } else {
    // if token is invalid, then send error
    res.status(401).send("Unauthorized");
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});