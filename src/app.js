const express = require('express');

const app = express();
const PORT = 3000;

app.use("/", (err, req, res, next) => {
  console.log("error 1");

  if (err) {
    // log your error
    res.status(500).send("Internal Server Error");
  }
});

app.get("/user", (req, res) => {
  try {
    throw new Error("User Data");
    res.send("User Data send");
  } catch (err) {
    res.status(500).send("Something Server Error");
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});