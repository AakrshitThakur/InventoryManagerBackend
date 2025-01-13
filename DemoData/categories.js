const mongoose = require("mongoose");
const CategoryClass = require("../models/Category.js");

// Connecting DB(InventoryManager)'
mongoose
  .connect("mongodb://localhost:27017/InventoryManager")
  .then(() => {
    console.log("DB SUCCESSFULLY CONNECTED");
    const RemoveEverything = async () => {
      const check = await CategoryClass.deleteMany({});
      if (check)
        console.log(
          "DATA SUCCESSFULLY DELETED FROM categories collection of DB(InventoryManager)"
        );
      else console.log("OOPS! Something went wrong while deletion");
    };
    // Removing everything from categories collection
    RemoveEverything();
  })
  .catch((error) => {
    console.error("OOPS! DB CONNECTION NOT ESTABLISHED", error);
  });
