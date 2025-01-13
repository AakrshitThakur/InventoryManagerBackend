const mongoose = require('mongoose');
const UserModel = require('../models/User.js');

// Connecting DB(RentManager)'
mongoose.connect('mongodb://localhost:27017/InventoryManager')
    .then(() => {
        console.log('DB SUCCESSFULLY CONNECTED');
        const RemoveEverything = async () => {
            const check = await UserModel.deleteMany({});
            if (check) console.log("DATA SUCCESSFULLY DELETED FROM shopkeepers collection of DB(InventoryManager)");
            else console.log("OOPS! Something went wrong while deletion");
        }

    // Removing everything from users collection
        RemoveEverything();
    })
    .catch((error) => {
        console.error('OOPS! DB CONNECTION NOT ESTABLISHED', error);
    });




