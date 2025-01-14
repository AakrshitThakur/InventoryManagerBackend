const mongoose = require("mongoose");
const UserModel = require("../models/User.js");

const MONGODB_URI = `mongodb+srv://AakrshitThakur:${encodeURIComponent(process.env.AakrshitThakurUSER_PSD)}@cluster0.un7wj.mongodb.net/InventoryManager?retryWrites=true&w=majority&appName=Cluster0`;


// Connecting DB(RentManager)'
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("DB SUCCESSFULLY CONNECTED");
    const RemoveEverything = async () => {
      const check = await UserModel.deleteMany({});
      if (check)
        console.log(
          "DATA SUCCESSFULLY DELETED FROM shopkeepers collection of DB(InventoryManager)"
        );
      else console.log("OOPS! Something went wrong while deletion");
    };

    // Removing everything from users collection
    RemoveEverything();
  })
  .catch((error) => {
    console.error("OOPS! DB CONNECTION NOT ESTABLISHED", error);
  });
