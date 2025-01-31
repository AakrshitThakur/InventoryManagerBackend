// Main server file
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcryptjs = require("bcryptjs");

// Using cors module for API services to front-end
const cors = require("cors");

// Ensuring all environment variables are loaded before they are accessed.
require("dotenv").config();

const app = express();

app.set("trust proxy", 1); // Trust the first proxy

const CorsOption = {
  origin: ["http://localhost:5173", "https://inventorymanager2025.netlify.app"],
  credentials: true, // Allow cookies
};

// Requiring user defined modules in index.js
const UserClass = require("./models/User.js");
const ShopkeepersClass = require("./models/Shopkeeper.js");
const ShopsRouter = require("./routers/shops.js");
const CategoriesRouter = require("./routers/categories.js");
const GraphAnalysesRouter = require("./routers/GraphAnalyses.js");
const SendOTP = require("./utils/EmailService.js");
const GenerateRandomOTP = require("./utils/GenerateRandomOTP.js");

const MONGODB_URI =
  process.env.IS_PRODUCTION_ENV == "true"
    ? `mongodb+srv://AakrshitThakur:${encodeURIComponent(
        process.env.AakrshitThakurUSER_PSD
      )}@cluster0.un7wj.mongodb.net/InventoryManager?retryWrites=true&w=majority&appName=Cluster0`
    : "mongodb://localhost:27017/InventoryManager";

// Connecting DB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("DB SUCCESSFULLY CONNECTED");
  })
  .catch((error) => {
    console.error("OOPS! DB CONNECTION NOT ESTABLISHED", error);
  });

// Using connect-mongodb-session to store session data in MongoDB.
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("Session store error:", error);
});

// Third party middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(CorsOption));
// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a secure key
    resave: false, // Prevents the session from being saved back to the session store on every request, even if it wasn't modified
    saveUninitialized: false, // Helps avoid creating empty sessions for unauthenticated users, conserving resources
    store: store, // address of DB where all the session data will be stored
    cookie: {
      // connect.sid serves as a reference to the session data stored on the server
      secure: true, // Determines if the cookie is sent only over HTTPS.
      path: "/", // Ensure the cookie is set for the entire domain
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // Store session cookie for 24 hour on client side i.e. browser
    },
  })
);

// Middlewares for routers
app.use("/shops", GraphAnalysesRouter);
app.use("/shops", ShopsRouter);
app.use("/shops", CategoriesRouter);

// User signup route
app.post("/signup", async (req, res) => {
  console.log("Under /signup route");
  try {
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const psd = req.body.psd.trim();

    // Finding if user already exists or not
    const UserAlreadyExists = await UserClass.findOne({ email: email });
    if (UserAlreadyExists) {
      return res.json({ UserAlreadyExists: true });
    } else {
      // Now it is confirmed that the user does not already exist
      // Generate 4-digit OTP
      const OTP = GenerateRandomOTP();

      // Storing OTP data in the session object to verify it later with the OTP entered by the user.
      req.session.OTP = {
        value: OTP, // Store OTP
        ExpiresAt: Date.now() + 60 * 1000, // Expiry (1 minute)
        attempts: 0, // Track OTP verification attempts
      };
      // Setting user in session obj to make new user after OTP verification
      req.session.user = {
        username: username,
        email: email,
        password: psd,
      };

      // Sending OTP to the recipient
      SendOTP(email, OTP);

      res.json({ ShowOTPBox: true });
    }
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.msg,
        status: error.statusCode,
      },
    });
  }
});

// User OTP verification
app.post("/VerifyOTP", async (req, res) => {
  console.log("Under /VerifyOTP route");
  try {
    const UserOTP = req.body.OTP.trim();

    if (!req.session.OTP) {
      return res.json({
        ErrorMsg: { msg: "OTP expired or not found", status: "error" },
      });
    }

    const { value, ExpiresAt, attempts } = req.session.OTP;

    // Checking expiration
    if (Date.now() > ExpiresAt) {
      // Deleting unwanted sessions
      delete req.session.OTP;
      delete req.session.user;
      return res.json({ ErrorMsg: { msg: "OTP expired", status: "error" } });
    }

    // Checking max attempts
    if (attempts >= 3) {
      // Deleting unwanted sessions
      delete req.session.OTP;
      delete req.session.user;
      return res.json({
        ErrorMsg: { msg: "Too many failed attempts", status: "error" },
      });
    }

    // Comparing OTP (convert to string to prevent type mismatch)
    if (UserOTP == value.toString()) {
      // Clear OTP object after successful verification
      delete req.session.OTP;

      // Storing hashed password in the DB
      const HashedPsd = await bcryptjs.hash(req.session.user.password, 10);
      const NewUser = new UserClass({
        username: req.session.user.username,
        email: req.session.user.email,
        password: HashedPsd,
      });

      // Modifying the user object (excluding the password property for security purposes)
      req.session.user = {
        id: NewUser._id,
        username: req.session.user.username,
        email: req.session.user.email,
      };
      console.log(await NewUser.save());
      return res.json({
        SuccessMsg: {
          username: req.session.user.username,
          status: "success",
        },
      });
    } else {
      // OTP entered by the user doesn't match
      req.session.OTP.attempts += 1; // Increase failed attempt count
      return res.json({ ErrorMsg: { msg: "Invalid OTP", status: "error" } });
    }
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.msg,
        status: error.statusCode,
      },
    });
  }
});

// User login route
app.post("/login", async (req, res) => {
  try {
    console.log("Under /login route");

    const email = req.body.email.trim();
    const psd = req.body.psd.trim();

    // Finding if account is already made or not
    const user = await UserClass.findOne({ email: email });
    if (!user)
      return res.json({
        ErrorMsg: {
          msg: "Incorrect credentials, please try again",
          status: "error",
        },
      });
    else {
      // Comparing password entered by the user with the password associated with username password
      const ComparePsd = await bcryptjs.compare(psd, user.password);
      if (!ComparePsd)
        return res.json({
          ErrorMsg: {
            msg: "Incorrect credentials, please try again",
            status: "error",
          },
        });
      else {
        // Setting current user data
        req.session.user = {
          id: user._id,
          username: user.username,
          email: user.email,
        };
        console.log(req.session);
        return res.json({
          SuccessMsg: {
            msg: `Welcome back ${user.username}, you can click on the "Create Shop" button to create your own shop and manage your goods.`,
            status: "success",
          },
        });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.msg,
        status: error.statusCode,
      },
    });
  }
});

// User logout route
app.post("/logout", (req, res) => {
  console.log("Under /logout route");
  try {
    req.session.destroy((error) => {
      if (error) {
        return res.json({
          msg: "An error occurred while logging out. Please try again",
        });
      }
      res.clearCookie("connect.sid"); // Optional: Clear the cookie
      return res.json({
        msg: "Successfully logged out. Please sign up or log in to continue.",
      });
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.msg,
        status: error.statusCode,
      },
    });
  }
});
// 3000
app.listen(process.env.PORT, () => {
  console.log("LISTENNING ON PORT 3000");
});
