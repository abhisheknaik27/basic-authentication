const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

function jwtAdminMiddleware(req, res, next){
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    try{
        const decodedVal = jwt.verify(jwtToken, JWT_SECRET);
        if(decodedVal.username){
            next()
        } else { 
            res.status(403).json({ msg: 'You are not authenticated' })
        };  
    } catch(e){
        res.json({msg: 'ERROR'})
    }
    
}

module.exports = jwtAdminMiddleware;