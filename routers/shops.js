// Shops routes
const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication.js");
const CheckAuthorization = require("../middlewares/CheckAuthorization.js");
const upload = require("../middlewares/multer.js");
const ShopkeepersClass = require("../models/Shopkeeper.js");
const UserClass = require("../models/User.js");
const CategoryClass = require("../models/Category.js");
const cloudinary = require("../utils/cloudinary.js");

// Display all shops route
router.get("/", async (req, res) => {
  try {
    console.log("Under /shops route");

    // Retrieving arrays of objects
    const shops = await ShopkeepersClass.find();
    res.json({ shops: shops });
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.status,
      },
    });
  }
});

// Viewing all the shops associated with current user
router.get("/ViewMyShops", CheckAuthentication, async (req, res) => {
  try {
    console.log("Under /shops/ViewMyShops route");
    const UserID = req.session.user.id;
    const user = await UserClass.findById(UserID).populate("shops");
    res.json({ MyShops: user.shops });
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.statusCode,
      },
    });
  }
});

// Display shop route
router.get(
  "/:id",
  CheckAuthentication,
  CheckAuthorization,
  async (req, res) => {
    try {
      console.log("Under /shops/:id route");
      const { id } = req.params;

      // Retrieving matched object from id
      const shop = await ShopkeepersClass.findById(id);
      res.json({ shop });
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

/*Creating a new shop route
Executing multer middleware to insert an image to Cloudinary account
Multer will seach for 'ShopImg' key when passed FormData() obj from the frontend */
router.post(
  "/create",
  CheckAuthentication,
  upload.single("ShopImg"),
  async (req, res) => {
    try {
      console.log("Under shops/create route");
      const CreateShopData = req.body; // Will contain all the fields except ShopImg

      if (!req.file) CreateShopData.ShopImgURL = "/images/NoImageFound.png";
      else {
        CreateShopData.ShopImgURL = req.file.path;
        CreateShopData.ShopFilename = req.file.filename;
      }

      const shop = new ShopkeepersClass(CreateShopData);

      // Pushing this shop id in the user document
      console.log(
        await UserClass.findByIdAndUpdate(
          req.session.user.id,
          { $push: { shops: shop._id } },
          { new: true }
        )
      );
      console.log(await shop.save());
      res.json({ ShopID: shop._id });
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

// Edit shop route
router.post(
  "/:id/edit",
  CheckAuthentication,
  CheckAuthorization,
  upload.single("ShopImg"),
  async (req, res) => {
    try {
      console.log("under shops/:id/edit route");
      const { id } = req.params;

      // No image uploaded by the User
      if (!req.file) {
        const shop = await ShopkeepersClass.findById(id);
        const ModifyShopData = {
          author: req.body.author,
          ShopImgURL: shop.ShopImgURL,
          ShopFilename: shop.ShopFilename,
          ShopName: req.body.ShopName,
          description: req.body.description,
          address: req.body.address,
          categories: shop.categories,
        };
        console.log(
          await ShopkeepersClass.findByIdAndUpdate(id, ModifyShopData, {
            new: true,
          })
        );
        res.json({ ShopID: id });
      } else {
        const shop = await ShopkeepersClass.findById(id);
        // Delete the existing image using the publicId
        await cloudinary.uploader.destroy(shop.ShopFilename);

        const ModifyShopData = {
          auther: req.body.auther,
          ShopImgURL: req.file.path,
          ShopFilename: req.file.filename,
          ShopName: req.body.ShopName,
          description: req.body.description,
          address: req.body.address,
          categories: shop.categories,
        };

        console.log(
          await ShopkeepersClass.findByIdAndUpdate(id, ModifyShopData, {
            new: true,
          })
        );
        res.json({ ShopID: id });
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

// Delete shop route
router.post(
  "/:id/delete",
  CheckAuthentication,
  CheckAuthorization,
  async (req, res) => {
    try {
      console.log("Under /shops/:id/delete route");

      const { id } = req.params;
      const user = await UserClass.findOne(req.session.user.id);

      // Excluding shopkeeper object reference from user.shops array
      const NewShops = user.shops.filter((shop) => shop != id);
      user.shops = NewShops;
      console.log(await user.save());

      // Deleting all the categories associated with this shop
      const shop = await ShopkeepersClass.findById(id);

      // Delete the existing image
      await cloudinary.uploader.destroy(shop.ShopFilename);

      // Removing all the categories one by one
      shop.categories.map(async (CategoryID) => {
        console.log(await CategoryClass.findByIdAndDelete(CategoryID));
      });

      console.log(await ShopkeepersClass.findByIdAndDelete(id));
      res.json({
        SuccessMsg:
          'Shop successfully deleted. you can click on the "Create Shop" button to create your own shop and manage your goods.',
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

