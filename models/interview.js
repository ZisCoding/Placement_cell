const mongoose = require("mongoose");

// creating schema to store user data
const interviewSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true, 
        unique: true,
    },
    date:{
        type: String,
        required: true, 
    },
    students:[
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student', 
            },
            status: {
                type: String,
                required: true,
            },
        }
    ]
},{
    timestamps: true
})


module.exports = mongoose.model('Interview',interviewSchema);