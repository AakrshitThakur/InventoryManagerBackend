// Authorization middleware to check if a user is authorized to approve or decline a request
const ReqClass = require("../models/Request.js");

// Middleware function to check authorization for handling requests
const CheckAuthorizationForReqs = async (req, res, next) => {
  try {
    console.log("Under CheckAuthorizationForReqs middleware"); // Logging middleware entry

    const { id } = req.params; // Extracting request ID from URL parameters
    const UserID = req.session.user.id; // Extracting user ID from session data

    // Fetching the request document from the database using the request ID
    const request = await ReqClass.findOne({ _id: id });

    // Check if the logged-in user is the receiver of the request
    if (request.receiver.equals(UserID)) return next(); // If authorized, proceed to the next middleware

    // If unauthorized, send an error response
    res.json({
      AuthorizationError: {
        msg: "You are not authorized to alter the request",
        status: "error",
      },
    });
  } catch (error) {
    console.error(error.message); // Logging error details

    // Sending a generic error response
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.status || 500, // Defaulting to 500 if no status is provided
      },
    });
  }
};

// Exporting the middleware function for use in other parts of the application
module.exports = CheckAuthorizationForReqs;
