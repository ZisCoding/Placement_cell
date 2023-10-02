const mongoose = require("mongoose");

// this function will connect to mongodb
async function connection(){
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/placement_cell");
        console.log("Connect to DB Successfully");
    } catch (error) {
        console.error("Error in conneting to DB\n",error);
    }
}

module.exports.db =  connection();

