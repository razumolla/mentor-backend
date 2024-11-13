// Import the Express module
const express = require('express');

// this is the instance of express js application
const app = express();


// Define a port
const PORT = 3000;




app.get(/.*fly$/, (req, res) => {
  res.send({ firname: "Razu", lastname: "Molla" });
})

app.get("/user/:userID/:name/:password", (req, res) => {
  console.log(req.params);
  res.send('post users !')
})


// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
