const { Admin } = require('../db');

cons
function adminMiddleware(req, res, next){
    const uname = req.headers.uname;
    const pass = req.headers.pass;
    
    Admin.findOne({
        username: uname,
        password: pass
    })
    .then(value => {
        if(value) next();
        else res.status(403).json({msg: 'ADMIN NOT FOUND'});
    })

}

module.exports = adminMiddleware;