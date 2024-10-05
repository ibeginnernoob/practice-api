const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt=require('jsonwebtoken');

const jwtPassword='some secret';

import { User, Course, Admin } from "../db/index.js";

// Admin Routes
router.post('/signup',async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;

    try{
        const admin=new Admin({
            username:username,
            pass:password
        });
    
        await admin.save();
    
        return res.status(200).json({
            msg:'Admin successfully created'
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
        const admin=await Admin.findOne({username:username});
        if(!admin){
            return res.status(404).json({
                msg:'Pls signup before signing in!'
            });
        } else{
            if(password!==admin.pass){
                return res.status(401).json({
                    msg:'Wrong password!'
                });
            }
            const tokenPayload={
                adminId:admin._id
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

router.post('/courses', adminMiddleware,async (req, res) => {
    const title=req.body.title;
    const description=req.body.description;
    const price=req.body.price;
    const imageLink=req.body.imageLink;

    try{
        const course=new Course({
            title:title,
            description:description,
            price:price,
            imageLink:imageLink,
            published:true
        });
    
        const newCourse=await course.save();

        return res.status(201).json({
            msg:'Course successfully created!',
            courseId:newCourse._id
        });
    } catch(err){
        return res.status(500).json({
            msg:'Something went wrong'
        });
    }
});

router.get('/courses', adminMiddleware,async (req, res) => {
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

module.exports = router;