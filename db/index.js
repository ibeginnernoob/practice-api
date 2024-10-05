const mongoose = require('mongoose');

const MONGODB_URI='mongodb+srv://Adheil:Ahana123@cluster0.rblysmw.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Define schemas
const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    }
});

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    purchased_courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageLink:{
        type:String,
        required:true
    },
    published:{
        type:Boolean,
        required:true
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}