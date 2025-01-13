const mongoose = require("mongoose");
const ShopkeepersClass = require("../models/Shopkeeper.js");

mongoose
  .connect("mongodb://localhost:27017/InventoryManager")
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
    // ShopkeepersClass.create(DemoShopkeepersData)
    //     .then(() => {
    //         console.log('DATA SUCCESSFULLY INSERTED INTO shopkeepers collection of DB(RentManger)');
    //     })
    //     .catch((error) => {
    //         console.log('OOPS! CANNOT INSERT YOUR DEMO DATA', error);
    //     });
  })
  .catch((error) => {
    console.log("OOPS! CANNOT DELETE prev documents", error);
  });
