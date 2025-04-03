// Authorization middleware
const UserClass = require("../models/User.js");

// Middleware to check if the user is authorized to access a specific shop
const CheckAuthorizationForShops = async (req, res, next) => {
  try {
    console.log("Under CheckAuthorizationForShops middleware");

    // Extract shop ID from request parameters
    const { id } = req.params;

    // Retrieve the logged-in user's ID from the session
    const UserID = req.session.user.id;

    // Fetch the user from the database using their ID
    const user = await UserClass.findOne({ _id: UserID });

    // Iterate through the user's associated shops to check authorization
    for (let ShopID of user.shops) {
      if (ShopID.equals(id)) {
        // If the user has access to the shop, proceed to the next middleware
        return next();
      }
    }

    // If the user is not authorized, send an authorization error response
    res.json({
      AuthorizationError: {
        msg: "You are not authorized to alter the resources",
        status: "error",
      },
    });
  } catch (error) {
    // Log the error to the console for debugging
    console.error(error.message);

    // Send a generic error response if an exception occurs
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.status,
      },
    });
  }
};

// Export the middleware function for use in other parts of the application
module.exports = CheckAuthorizationForShops;
