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

const MONGODB_URI = `mongodb+srv://AakrshitThakur:${encodeURIComponent(
  process.env.AakrshitThakurUSER_PSD
)}@cluster0.un7wj.mongodb.net/InventoryManager?retryWrites=true&w=majority&appName=Cluster0`;
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
    const { username, psd } = req.body;

    // Finding if user already exists or not
    const UserAlreadyExists = await UserClass.findOne({ username: username });
    if (UserAlreadyExists) {
      return res.json({ username: "The username already exists" });
    } else {
      // Now it is confirmed that the user does not already exist
      const HashedPsd = await bcryptjs.hash(psd, 10);
      const NewUser = new UserClass({ username, password: HashedPsd });
      console.log(await NewUser.save());
      req.session.user = {
        id: NewUser._id,
        username: username,
      };
      res.json({ username: `${username}` });
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
    const { username, psd } = req.body;

    // Finding if account is already made or not
    const user = await UserClass.findOne({ username: username });
    if (!user)
      return res.json({ msg: "Incorrect credentials, please try again" });
    else {
      // Comparing password entered by the user with the password associated with username password
      const ComparePsd = await bcryptjs.compare(psd, user.password);
      if (!ComparePsd)
        return res.json({ msg: "Incorrect credentials, please try again" });
      else {
        // This method is used to regenerate a new session ID while preserving the session data.
        req.session.regenerate((error) => {
          if (error)
            return res.json({ msg: "Incorrect credentials, please try again" });
          // Setting current user data
          req.session.user = {
            id: user._id,
            username: username,
          };
          return res.json({
            msg: `Welcome back ${username}, you can click on the "Create Shop" button to create your own shop and manage your goods.`,
          });
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
