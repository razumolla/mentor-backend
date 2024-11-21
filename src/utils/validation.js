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
  const { emailId } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid emailId");
  }
}

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName", "lastName", "age", "photoUrl", "gender", "about", "skills"
  ];
  // const isEditAloowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
  const isEditAloowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  return isEditAloowed;
}

module.exports = { validateSignupData, validateLoginData, validateProfileEditData }