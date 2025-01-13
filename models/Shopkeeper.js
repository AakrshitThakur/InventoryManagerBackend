// Shopkeeper model
const mongoose = require("mongoose");

const ShopkeepersSchema = mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  ShopName: {
    type: String,
    required: true,
  },
  ShopImgURL: {
    type: String,
  },
  ShopFilename: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  categories: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
});

const ShopkeepersClass = mongoose.model("Shopkeeper", ShopkeepersSchema);

module.exports = ShopkeepersClass;
