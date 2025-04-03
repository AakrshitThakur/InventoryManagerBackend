// Authorization middleware
const UserClass = require("../models/User.js");

const GrantReadAccessForShops = async (req, res, next) => {
  try {
    console.log("Under GrantReadAccessForShops middleware");
    const { id } = req.params;

    const UserID = req.session.user.id;
    const user = await UserClass.findOne({ _id: UserID });

    // Checking every shop ID in user.shops array
    for (let ShopID of user.shops) {
      if (ShopID == id) {
        req.HasCRUDPermissions = true;
        return next();
      }
    }
    req.HasCRUDPermissions = false;
    return next();
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.status,
      },
    });
  }
};

module.exports = GrantReadAccessForShops;
