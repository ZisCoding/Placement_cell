const express = require('express');
const userController = require('../controllers/userController.js');
const passport = require('passport');

const router = express.Router();

router.get('/',userController.home);
router.get('/signup',userController.signUp)
router.post('/signup',userController.signUp);
router.get('/signin',userController.signIn)
router.post('/signin',passport.authenticate(
    'local',
    {failureRedirect: '/signin'}
),userController.signIn);
router.get('/signout',userController.signOut);
router.get('/addstudent',userController.addStudent);
router.post('/addstudent',userController.addStudent);
router.get("/studentdetail/:id",userController.studentDetail);
router.get('/deletestudent/:id',userController.deleteStudent);
router.get("/addinterview",userController.addInterview);
router.post("/addinterview",userController.addInterview);
router.get("/interviewdetail/:id",userController.interviewDetail);
router.post('/scheduleinterview/:id',userController.scheduleInterview);
router.get("/report",userController.createReport);
module.exports = router;