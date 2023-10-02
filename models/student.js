const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    college:{
        type:String,
        required: true
    },
    collegeId:{
        type:String,
        required: true,
        unique: true
    },
    dsaScore:{
        type:String,
        required: true
    },
    webdScore:{
        type:String,
        required: true
    },
    reactScore:{
        type:String,
        required: true
    },
    placementStatus:{
        type:String,
        required: true
    },
    batch:{
        type:String,
        required: true
    },
    interviews:[
        {
            company:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Interview"
            },
            status:{
                type:String
            }
        }
    ]
})

module.exports  = mongoose.model('Student',studentSchema);