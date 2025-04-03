// Middleware for authentication
const CheckAuthentication = (req, res, next) => {
  try {
    // Logging to indicate middleware execution
    console.log("Under CheckAuthentication middleware");

    // Check if the user session exists
    if (req.session.user) {
      return next(); // Proceed to the next middleware or route handler
    }

    // If user is not authenticated, send an authentication error response
    res.json({
      AuthenticationError: {
        msg: "Please login or signup to continue",
        status: "error",
      },
    });
  } catch (error) {
    // Log any unexpected errors
    console.error(error.message);

    // Handle general errors and send a response with error details
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.status, // Might be undefined if error object doesn't have a status
      },
    });
  }
};

// Export the middleware function for use in other parts of the application
module.exports = CheckAuthentication;
