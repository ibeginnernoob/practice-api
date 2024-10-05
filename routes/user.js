const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt=require('jsonwebtoken');

const jwtPassword='some secret';

import { User, Course, Admin } from "../db/index.js";

// User Routes
router.post('/signup',async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;

    try{
        const user=new User({
            username:username,
            pass:password
        });
    
        await user.save();
    
        return res.status(200).json({
            msg:'User successfully created'
        });
    } catch(err){
        return res.status(500).json({
            msg:'Something went wrong'
        });
    }
});

router.post('/signin',async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;

    try{
        const user=await User.findOne({username:username});
        if(!user){
            return res.status(404).json({
                msg:'Pls signup before signing in!'
            });
        }
        if(user){
            if(user.pass!==password){
                return res.status(401).json({
                    msg:'Wrong password!'
                });
            }
            const tokenPayload={
                userId:user._id
            };
            
            const token=jwt.sign(tokenPayload,jwtPassword);

            return res.status(200).json({
                token:token
            });
        }
    } catch(err){
        return res.status(500).json({
            msg:'Something went wrong'
        });
    }
});

router.get('/courses',async (req, res) => {
    try{
        const courses=await Course.find({});
        return res.status(200).json({
            courses:courses
        });
    } catch(err){
        return res.status(500).json({
            msg:'Something went wrong'
        });
    }
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    const courseId=req.params.courseId;
    const userId=req.userId;
    try{
        const user=await User.find({_id:userId});
        user.purchased_courses.push(courseId);
        await user.save();

        return res.status(200).json({
            msg:'Purchase successful!'
        });
    } catch(err){
        return res.status(500).json({
            msg:'Something went wrong'
        });
    }
});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    const userId=req.userId;
    try{
        const purchased_courses=await User.findOne({_id:userId}).populate('purchased_courses');

        return res.status(200).json({
            purchased_courses:purchased_courses
        });

    } catch(err){
        return res.status(500).json({
            msg:'Something went wrong'
        });
    }
});

module.exports = router