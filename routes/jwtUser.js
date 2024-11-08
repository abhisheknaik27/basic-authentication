const jwt = require('jsonwebtoken');
const { Router } = require('express');
const jwtUserMiddleware = require('../middleware/jwtUser');
const { User, Course } = require('../db');
const router = Router();
const { JWT_SECRET } = require('../config');

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username,
        password
    }).then(() => {
        res.json({msg: "User created"})
    }).catch(() => {
        res.json({msg: "Failed"})
    })
})

router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username, 
        password
    })
    if(user){
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token }); 
    } else{
        res.status(403).json({msg: "User not found"});
    }
})

router.get('/courses', async (req, res) => {
    const response = await Course.find({});
    res.json({
        response
    })
})

router.post('/courses/:courseId', jwtUserMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.username;
    
    try{
        await User.updateOne({
            username
        }, {
            "$push": {
                purchasedCourses: courseId
            }
        })
    }catch (e) {
        res.json({msg: "Error"})
    }
    res.json({
        msg: 'Purchase completed'
    })
})

router.get('/purchasedCourses', jwtUserMiddleware, async (req, res) => {
    const username = req.username;

    const user = await User.findOne({
        username,
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({courses: courses})
})

module.exports = router;