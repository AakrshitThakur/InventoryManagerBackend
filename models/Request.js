// Want model
const mongoose = require("mongoose");

const ReqSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ItemID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  CreationDate: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Number must be greater than 0"], // Ensures positive numbers only
  },
  msg: {
    type: String,
    required: true,
  },
  ItemImgURL: {
    type: String,
  },
  status: {
    type: String,
    enum: ["init", "accepted", "rejected"], // Three unique states
    default: "init",
  },
  response: {
    type: String,
  },
});

const ReqClass = mongoose.model("Request", ReqSchema);

module.exports = ReqClass;
