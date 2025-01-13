// Middleware for authentications
const CheckAuthentication = (req, res, next) => {
  try {
    console.log("Under CheckAuthentication middleware");
    if (req.session.user) {
      return next();
    }
    res.json({
      AuthenticationError: {
        msg: "Please login or signup to continue",
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

module.exports = CheckAuthentication;
