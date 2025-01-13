// Authorization middleware
const UserClass = require("../models/User.js");

const CheckAuthorization = async (req, res, next) => {
  try {
    console.log("Under IsAuthorized middleware");
    const { id } = req.params;

    const UserID = req.session.user.id;
    const user = await UserClass.findOne({ _id: UserID });

    // Checking every shop ID in user.shops array
    for (let ShopID of user.shops) {
      if (ShopID == id) return next();
    }
    res.json({
      AuthorizationError: {
        msg: "Sorry! You aren't allowed to view this resource.",
        status: "error",
      },
    });
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

module.exports = CheckAuthorization;
