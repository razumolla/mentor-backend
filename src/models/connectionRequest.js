const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const connectionRequestSchema = new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: "User", // refercence to the user collection
    required: true,
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect Status` // custom error message
    }
  },
}, { timestamps: true });

connectionRequestSchema.pre('save', function (next) {
  const connectionRequest = this;

  //  i can not send a connection request to myself
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself");
  }
  next();
});

// module.exports = new mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);