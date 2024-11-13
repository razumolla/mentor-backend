// Import the Express module
const express = require('express');
// this is the instance of express js application
const app = express();
// Define a port
const PORT = 3000;

// app.use("/route", rh1, rh2, rh3, rh4);
// app.use("/route", [rh1, rh2], rh3, rh4);
// app.use("/route", [rh1, rh2, rh3, rh4]);
// app.use("/route", rh1, [rh2, rh3, rh4]);

app.use(
  "/user",
  [(req, res, next) => {
    console.log("user 1 ");
    next();
  },
  (req, res, next) => {
    console.log("user 2 --");
    next()
  }],
  (req, res, next) => {
    console.log("user 3 --");
    next()
  },
  (req, res, next) => {
    console.log("user 4 --");
    res.send("Response 4");
  }
);

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
