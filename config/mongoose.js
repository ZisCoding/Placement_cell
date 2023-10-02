const mongoose = require("mongoose");

// this function will connect to mongodb
async function connection(){
    try {
        await mongoose.connect('mongodb+srv://zishan:zishan@cluster0.qf3xyvd.mongodb.net/');
        console.log("Connect to DB Successfully");
    } catch (error) {
        console.error("Error in conneting to DB\n",error);
    }
}

module.exports.db =  connection();

