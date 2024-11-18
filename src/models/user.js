const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    index: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 12,
    max: 100,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["Male", "Female", "Other"].includes(value)) {
        throw new Error("Invalid Gender");
      }
    },
  },
  photoUrl: {
    type: String,
    default: "https://med.gov.bz/wp-content/uploads/2020/08/dummy-profile-pic.jpg",
  },
  about: {
    type: String,
    default: "I am a developer",
  },
  skills: {
    type: Array,
    default: ["Javascript", "NodeJS", "MongoDB"],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);