const jwt=require('jsonwebtoken');

const jwtPassword='some secret';

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    try{
        const token=req.headers.Authorized.split(' ')[1];

        const isAuth=jwt.verify(token,jwtPassword);

        if(isAuth.success===true){
            req.adminId=isAuth.data.adminId;
            next();
        }
    } catch(err){
        return res.status(401).json({
            msg:'Could not be authorized.'
        });
    }
}

module.exports = adminMiddleware;