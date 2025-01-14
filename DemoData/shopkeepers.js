const mongoose = require("mongoose");
const ShopkeepersClass = require("../models/Shopkeeper.js");

const MONGODB_URI = `mongodb+srv://AakrshitThakur:${encodeURIComponent(process.env.AakrshitThakurUSER_PSD)}@cluster0.un7wj.mongodb.net/InventoryManager?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("DB SUCCESSFULLY CONNECTED");
  })
  .catch((error) => {
    console.error("OOPS! DB CONNECTION NOT ESTABLISHED", error);
  });

// John Smith => demo
// Linda Wang => demo
// Samantha Lee => demo
// Carlos Ruiz => demo

// Removing everything from shopkeepers collection
ShopkeepersClass.deleteMany({})
  .then(() => {
    console.log(
      "DATA SUCCESSFULLY DELETED FROM shopkeepers collection of DB(InventoryManager)"
    );
  })
  .catch((error) => {
    console.log("OOPS! CANNOT DELETE prev documents", error);
  });
