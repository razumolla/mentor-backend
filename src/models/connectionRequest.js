const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionRequestSchema = new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accepeted", "rejected"],
      message: `{VALUE} is incorrect Status` // custom error message
    }
  },
}, { timestamps: true });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);