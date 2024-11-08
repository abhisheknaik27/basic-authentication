const express = require('express');
const { Admin, User, Course } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const jwtAdminMiddleware = require('../middleware/jwtAdmin');

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username,
        password
    })
    .then(() => {
        res.json({msg: 'Admin created successfully'})
    })
    .catch(() => {
        res.json({msg: 'Error creating admin'})
    })
});

router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username,
        password
    });
    if(user){
        const token = jwt.sign({ username }, JWT_SECRET );
        res.json({ token });
    } else{
        res.status(403).json({ msg: 'Incorrect credentials' });
    }
});

router.post('/courses', jwtAdminMiddleware, async (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const imageLink = req.body.imageLink;
    const price = req.body.price;

    const newCourse = await Course.create({
        title,
        desc, 
        imageLink,
        price
    });
    res.json({
        msg: 'Course created successfully',
        courseId: newCourse._id
    });
});

router.get('/courses',jwtAdminMiddleware , async (req, res) => {
    const response = await Course.find({});
    res.json({
        courses: response
    })
    
});

module.exports = router;