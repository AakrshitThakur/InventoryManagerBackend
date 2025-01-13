// User model
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // For unique usernames
  },
  password: {
    type: String,
    required: true,
  },

  // Each elements in this array will points towards the documents of shopkeepers collection
  shops: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shopkeeper",
      },
    ],
    validate: {
      // v refers to the value of the field being validated
      validator: function (v) {
        return v.length <= 5; // Restrict to a maximum of 5 elements
      },
    },
    message: "You can only have up to 5 shops.",
  },
});
module.exports = mongoose.model("User", UserSchema);
