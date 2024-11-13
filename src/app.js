const express = require('express');
const app = express();
const PORT = 3000;

// app.use("/route", rh1, rh2, rh3, rh4);
// app.use("/route", [rh1, rh2], rh3, rh4);
// app.use("/route", [rh1, rh2, rh3, rh4]);
// app.use("/route", rh1, [rh2, rh3, rh4]);
app.get(
  "/user",
  (req, res, next) => {
    console.log("user 2 ");
    // res.send("Response 2"); 
    next()
  }
);
app.get(
  "/user",
  (req, res, next) => {
    console.log("user 1 ");
    next();
  }
);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});