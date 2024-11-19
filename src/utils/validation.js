var validator = require('validator');

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Missing required fields");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid emailId");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }

}

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid emailId");
  }
}

module.exports = { validateSignupData, validateLoginData }