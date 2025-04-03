// Create requests routes
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication.js");
const CheckAuthorizationForShops = require("../middlewares/CheckAuthorizationForShops.js");
const CategoryClass = require("../models/Category.js");
const ShopkeeperClass = require("../models/Shopkeeper.js");
const UserClass = require("../models/User.js");
const ReqClass = require("../models/Request.js");

// Creating a new request
router.post(
  "/:id/stockroom/categories/:CategoryID/:ItemID/reqs/new",
  CheckAuthentication,
  async (req, res) => {
    console.log(
      "Under /shops/:id/stockroom/categories/:CategoryID/:ItemID/wants/new route"
    );
    try {
      const { id, CategoryID, ItemID } = req.params;
      const { quantity, ReqMsg } = req.body;
      const shop = await ShopkeeperClass.findById(id);

      // Finding receiver's user-info
      const ReceiverUser = await UserClass.findOne({
        shops: shop._id,
      });

      // This will return parent document of matched sub-document
      const category = await CategoryClass.findOne(
        { _id: CategoryID, "items._id": ItemID },
        { "items.$": 1 } // Project only the first matched sub-document
      );
      // Finding item image URL
      const ItemImgURL = category.items[0].ItemPath;

      // Creating req
      const request = new ReqClass({
        sender: req.session.user.id,
        receiver: ReceiverUser._id,
        ItemID: new ObjectId(ItemID),
        quantity: quantity,
        msg: ReqMsg,
        ItemImgURL: ItemImgURL,
        status: "init",
        response: "",
      });
      console.log(await request.save());

      // Sending success message
      return res.json({
        SuccessMsg: { msg: "Request successfully created", status: "success" },
      });
    } catch (error) {
      console.error(error.message);
      res.json({
        GeneralError: {
          msg: error.message,
          StatusCode: error.statusCode,
        },
      });
    }
  }
);

module.exports = router;
