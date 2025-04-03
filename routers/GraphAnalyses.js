// GraphAnalyses routes
const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication.js");
const GrantReadAccessForShops = require("../middlewares/GrantReadAccessForShops.js");
const ShopkeepersClass = require("../models/Shopkeeper.js");
const UserClass = require("../models/User.js");
const CategoryClass = require("../models/Category.js");

// Extracting data from all the items of specific category and generating graphical data for graph analyses
router.get(
  "/:id/stockroom/categories/:CategoryID/GraphAnalyses",
  CheckAuthentication,
  GrantReadAccessForShops,
  async (req, res) => {
    try {
      console.log(
        "Under /:id/stockroom/categories/:CategoryID/GraphAnalyses route"
      );
      const { CategoryID } = req.params;
      let DataToSend = [];
      const category = await CategoryClass.findById(CategoryID);

      for (const item of category.items) {
        DataToSend.push({
          ItemName: item.ItemName,
          PerItemPurchasePrice: item.PerItemPurchasePrice,
          PerItemSellingPrice: item.PerItemSellingPrice,
          PerItemSellingDiscount: item.PerItemSellingDiscount,
          NoOfItems: item.NoOfItems,
          StockStatus: item.StockStatus,
          PaymentStatus: item.PaymentStatus,
        });
      }

      res.json({ GraphAnalysesData: DataToSend });
    } catch (error) {
      console.error(error.message);
      res.json({
        GeneralError: {
          msg: error.message,
          StatusCode: error.status,
        },
      });
    }
  }
);

module.exports = router;
