// categories routes
const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication.js");
const CheckAuthorization = require("../middlewares/CheckAuthorization.js");
const upload = require("../middlewares/multer.js");
const cloudinary = require("../utils/cloudinary.js");
const CategoryClass = require("../models/Category.js");
const ShopkeepersClass = require("../models/Shopkeeper.js");

// Sending categories made by user on specific shop ID
router.get(
  "/:id/stockroom/categories",
  CheckAuthentication,
  CheckAuthorization,
  async (req, res) => {
    console.log("Under /shops/:id/stockroom/categories route");
    try {
      const { id } = req.params;
      const shop = await ShopkeepersClass.findById(id).populate("categories");
      res.json({ categories: shop.categories });
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

// Making new category on specific shop ID
router.post(
  "/:id/stockroom/categories/new",
  CheckAuthentication,
  CheckAuthorization,
  async (req, res) => {
    console.log("Under /shops/:id/stockroom/categories/new route");
    try {
      const { id } = req.params;
      const category = await new CategoryClass(req.body);

      // Pushing this category id in the shopkeeper document
      console.log(
        await ShopkeepersClass.findByIdAndUpdate(
          id,
          { $push: { categories: category._id } },
          { new: true }
        )
      );

      console.log(await category.save());
      return res.json({
        SuccessMsg: `Category successfully created`,
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

// Sending category made by user on specific shop ID
router.get(
  "/:id/stockroom/categories/:CategoryID",
  CheckAuthentication,
  CheckAuthorization,
  async (req, res) => {
    console.log("Under /shops/:id/stockroom/categories/:CategoryID route");
    try {
      const { id, CategoryID } = req.params;
      const category = await CategoryClass.findById(CategoryID);
      res.json({ CategoryObj: category });
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

// Creating new item under specific category ID
router.post(
  "/:id/stockroom/categories/:CategoryID/new",
  CheckAuthentication,
  CheckAuthorization,
  upload.single("ItemImg"),
  async (req, res) => {
    try {
      console.log("Under :id/stockroom/categories/:CategoryID/new route");
      const { id, CategoryID } = req.params;
      const item = { ...req.body };
      if (!req.file) {
        item.ItemPath = "/images/NoImageFound.png";
        item.ItemFilename = null;
      } else {
        item.ItemPath = req.file.path;
        item.ItemFilename = req.file.filename;
      }
      const category = await CategoryClass.findById(CategoryID);
      category.items.push(item);
      console.log(await category.save());

      res.json({
        SuccessMsg: {
          msg: "Item successfully created",
          status: "success",
        },
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

// Editing details of item associated with specific category ID
router.post(
  "/:id/stockroom/categories/:CategoryID/:ItemID/edit",
  CheckAuthentication,
  CheckAuthorization,
  upload.single("ItemImg"),
  async (req, res) => {
    try {
      console.log("/:id/stockroom/categories/:CategoryID/:ItemID/edit");
      const { id, CategoryID, ItemID } = req.params;

      // No image uploaded by the User
      if (!req.file) {
        const ModifyItemData = {
          _id: ItemID, // Explicitly give ID to sub-document so that new isn't generated.
          ItemName: req.body.ItemName,
          ItemDescription: req.body.ItemDescription,
          PerItemPurchasePrice: req.body.PerItemPurchasePrice || -1,
          PerItemSellingPrice: req.body.PerItemSellingPrice || -1,
          PerItemSellingDiscount: req.body.PerItemSellingDiscount || -1,
          NoOfItems: req.body.NoOfItems || -1,
          ItemFilename: req.body.PrevImgFilename,
          ItemPath: req.body.PrevImgPath,
          StockStatus: req.body.StockStatus,
          PaymentStatus: req.body.PaymentStatus,
        };
        await CategoryClass.findOneAndUpdate(
          { _id: CategoryID, "items._id": ItemID }, // Match the parent document and sub-document
          { $set: { "items.$": ModifyItemData } },
          { new: true } // Use `$` to target the matched sub-document
        );
        res.json({ ItemID: ItemID });
      } else {
        // Delete the existing image using the publicId
        await cloudinary.uploader.destroy(req.body.PrevImgFilename);

        const ModifyItemData = {
          _id: ItemID, // Explicitly give ID to sub-document so that new isn't generated.
          ItemName: req.body.ItemName,
          ItemDescription: req.body.ItemDescription,
          PerItemPurchasePrice: req.body.PerItemPurchasePrice,
          PerItemSellingPrice: req.body.PerItemSellingPrice,
          PerItemSellingDiscount: req.body.PerItemSellingDiscount,
          NoOfItems: req.body.NoOfItems,
          ItemFilename: req.file.filename,
          ItemPath: req.file.path,
          StockStatus: req.body.StockStatus,
          PaymentStatus: req.body.PaymentStatus,
        };
        await CategoryClass.findOneAndUpdate(
          { _id: CategoryID, "items._id": ItemID }, // Match the parent document and sub-document
          { $set: { "items.$": ModifyItemData } },
          { new: true } // Use `$` to target the matched sub-document
        );
        res.json({ ItemID: ItemID });
      }
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

// Deleting the item from the category and also removing the associated image from cloud storage
router.post(
  "/:id/stockroom/categories/:CategoryID/:ItemID/delete",
  CheckAuthentication,
  CheckAuthorization,
  async (req, res) => {
    try {
      const { id, CategoryID, ItemID } = req.params;
      const category = await CategoryClass.findById(CategoryID);
      const item = await category.items.id(ItemID);

      // Delete the existing image
      await cloudinary.uploader.destroy(item.ItemFilename);

      // Remove the sub-document by filtering it out
      category.items = category.items.filter(
        (item) => item._id.toString() !== ItemID.toString()
      );
      console.log(await category.save());
      res.json({
        SuccessMsg: {
          msg: "Item successfully deleted",
          status: "success",
        },
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

// Getting item details
router.get(
  "/:id/stockroom/categories/:CategoryID/:ItemID",
  CheckAuthentication,
  CheckAuthorization,
  async (req, res) => {
    try {
      console.log("Under /:id/stockroom/categories/:CategoryID/:ItemID");
      const { CategoryID, ItemID } = req.params;

      // This will return parent document of matched sub-docuement
      const category = await CategoryClass.findOne(
        { _id: CategoryID, "items._id": ItemID },
        { "items.$": 1 } // Project only the first matched sub-document
      );
      res.json({ item: category.items[0] });
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
