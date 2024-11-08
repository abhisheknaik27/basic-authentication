const express = require('express');
const adminMiddleware = require('../middleware/admin');
const { Admin, Course } = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const uname = req.body.uname;
    const pass = req.body.pass;

    await Admin.create({
        username: uname,
        password: pass
    })
    .then(() => {
        res.json({msg: 'Admin created successfully'})
    })
    .catch(() => {
        res.json({msg: 'Error creating admin'})
    })
})

router.post('/courses', adminMiddleware, async (req, res) => {
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
})

router.get('/courses',adminMiddleware, async (req, res) => {
    const response = await Course.find({});
    res.json({
        courses: response
    })
    
})

module.exports = router;