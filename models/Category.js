// Category model
const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  ItemName: {
    type: String,
    required: true,
  },
  ItemDescription: {
    type: String,
  },
  PerItemPurchasePrice: {
    type: Number,
    default: -1,
  },
  PerItemSellingPrice: {
    type: Number,
    default: -1,
  },
  PerItemSellingDiscount: {
    type: Number,
    default: -1,
  },
  NoOfItems: {
    type: Number,
    default: -1,
  },
  ItemPath: {
    type: String,
  },
  ItemFilename: {
    type: String,
  },
  StockStatus: {
    type: String,
    default: "Not available",
  },
  PaymentStatus: {
    type: String,
    default: "Not available",
  },
});
const CategorySchema = mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
  },
  CategoryDescription: {
    type: String,
  },
  items: {
    type: [
      {
        type: ItemSchema,
      },
    ],
  },
});

const CategoryClass = mongoose.model("Category", CategorySchema);
module.exports = CategoryClass;
