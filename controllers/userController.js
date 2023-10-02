const User = require("../models/user.js")
const Student  = require("../models/student.js");
const Interview  = require('../models/interview.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const path = require("path");
const interview = require("../models/interview.js");

const csvWriter = createCsvWriter({
    path: path.join(__dirname,"../assets/csv/file.csv"),
    header:[
        {id: 'name', title: 'Name'},
        {id: 'college', title: 'College'},
        {id: "collegeId" , title: "College Id"},
        {id: "dsaScore:" , title: "DSA Score"},
        {id: "webdScore" , title: "WebD Score"},
        {id: "reactScore" , title: "React Score"},
        {id: "placementStatus" , title: "Placement"},
        {id: "batch" , title: "Batch"},
        {id: "interviews" , title: "Interview"},
    ]
});

module.exports.home = async (req,res)=>{

    if(req.user){
        try {
            const students = await Student.find({});
            const interviews = await Interview.find({});
    
            return   res.render('home.ejs',{
                user: req.user,
                students: students,
                interviews:interviews
            });
    
        } catch (error) {
            console.log("error in home controller\n",error)
            return res.redirect('back')
        }
    }

    return res.redirect('/signin')
    
}

module.exports.signUp = async (req,res)=>{
    
    //  if res method is get serve the sign_up page
    if(req.method == "GET"){
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        return res.render('sign_up.ejs',{
            user: req.user
        })
    }

    // creating the user 
    try {
        const user = await User.create(req.body);

        res.redirect("/signin");
    } catch (error) {
        console.log("Error in creating user \n",error);
        res.redirect('back');
    }
    
}

module.exports.signIn = async (req,res)=>{
    //  if res method is get serve the sign_in page
    if(req.method == "GET"){
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        return res.render('sign_in.ejs',{
            user: req.user
        })
    }

    res.redirect("/");
}

module.exports.signOut = async(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.error("Error in signing out",err)
            return ;
        }
    })
    res.redirect('/signin')
}

module.exports.addStudent = async (req,res)=>{
    if(req.method=="GET"){
        return res.render("add_student.ejs",{
            user: req.user
        });
    }
    const body = req.body;
    try {
        const student = await Student.create({
            name:body.name,
            college: body.college,
            collegeId:body.collegeId,
            dsaScore:body.dsa,
            reactScore:body.react,
            webdScore:body.webd,
            placementStatus:body.placementStatus,
            batch:body.batch
        })

        return res.redirect('/');
    } catch (error) {
        console.error("Error in creating student",error)
        return res.redirect('back');
    }

    
}

module.exports.studentDetail = async (req,res)=>{

    if(!req.user){
        return res.redirect('/signin')
    }

    try {
        const student = await Student.findById(req.params.id);

        const populated = await Student.populate(student,"interviews.company");


        return res.render('student_detail.ejs',{
            user:req.user,
            student:populated
        })
    } catch (error) {
        console.log("error in finding student \n",error);
        return res.redirect('back');
    }

}

module.exports.deleteStudent = async(req,res)=>{
    if(!req.user){
        return res.redirect('/signin');
    }

    try {
        const student =await Student.findById(req.params.id);
        

        for(let i=0 ; i<student.interviews.length ; i++ ){
            const interview  = await Interview.findById(student.interviews[i].company);

            // console.log(interview);

            interview.students = interview.students.filter((student)=>{

                return student.student.toString()!=req.params.id
            })

            interview.save();
            
        }

        student.deleteOne();

        return res.redirect('/');
    } catch (error) {
        console.log("Error in deleting\n",error);
        return res.redirect('back');
    }
}

module.exports.addInterview = async(req,res)=>{
    if(req.method=="GET"){
        return res.render("add_interview.ejs",{
            user:req.user
        });
    }

    try {
        const interview = await Interview.create(req.body);
        res.redirect("/");
    } catch (error) {
        console.log("Error in creating interview\n",error);
        res.redirect('back');
    }
}

module.exports.interviewDetail = async (req,res)=>{

    if(!req.user){
        return res.redirect('/signin')
    }

    try {
        const interview = await Interview.findById(req.params.id);

        const populated = await Interview.populate(interview,'students.student');

        return res.render('interview_detail.ejs',{
            user:req.user,
            interview: populated
        })
    } catch (error) {
        console.log("error in finding student \n",error);
        return res.redirect('back');
    }

}

module.exports.scheduleInterview = async (req,res)=>{

    if(!req.user){
        return res.redirect('/signin')
    }

    try {
        const interview = await Interview.findById(req.params.id);

        const student = await Student.findOne({collegeId:req.body.collegeId});


        interview.students.push({
            student: student._id,
            status: req.body.status
        })

        student.interviews.push({
            company: interview._id,
            status:req.body.status
        })
        
        interview.save();
        student.save();

       res.redirect("back");
    } catch (error) {
        console.log("error in scheduleInterview \n",error);
        return res.redirect('back');
    }
    
}

module.exports.createReport = async(req,res)=>{

    const records = []

    const std = await Student.find({});

    const students = [...std]

    for(const student of students){
    
        const record = {...student};

        const interview = student.interviews.map((interview)=>{
            return interview.status;
        })

        record._doc.interviews = interview;


        records.push(record._doc);
    }


    csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
            const file = path.join(__dirname,"../assets/csv/file.csv");

            return res.download(file)
        });
}