const { Router } = require('express');
const router = Router();
const userMiddleware = require('../middleware/user');
const { User, Course } = require('../db');
const { default: mongoose } = require('mongoose');

router.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.create({
        username,
        password,
    }).then(() => {
        res.json({msg: 'User created successfully'})
    }).catch(() => {
        res.json({msg: 'Error'})
    })
    
});

router.get('/courses', async (req, res) => {
    const response = await Course.find({});
    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req,res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username; 
    
    try{
        await User.updateOne({
            username: username,
        }, {
            "$push": { 
                purchasedCourses: courseId 
            }
        });
    } catch (e){
        console.log(e);
    }
   res.json({
        msg: 'Purchase completed'
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = await User.findOne({
        username: req.headers.username
    });
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    //console.log(user.purchasedCourses)
    res.json({ courses: courses });
})

module.exports = router;