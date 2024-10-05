const jwt=require('jsonwebtoken');

const jwtPassword='some secret';

function userMiddleware(req, res, next) {
    const token=req.headers.Authorization.split(' ')[1];

    try{
        const response=jwt.verify(token,jwtPassword);
        if(response.success=true){
            req.userId=response.data.userId;
            next();
        }
    } catch(err){
        return res.status(500).json({
            msg:'Something went wrong'
        });
    }
}

module.exports = userMiddleware;