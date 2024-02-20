const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/furShop");
        console.log("Connect DB Successful");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB;
