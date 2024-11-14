const adminAuth = (req, res, next) => {
  const token = "123456789";
  const isValid = token === "123456789";
  if (isValid) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}
const userAuth = (req, res, next) => {
  const token = "123456789";
  const isValid = token === "123456789s";
  if (isValid) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

module.exports = {
  adminAuth, userAuth
}