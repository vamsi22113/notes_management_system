const jwt=require('jsonwebtoken')
const authmiddleware=async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                message:'no token provided'
            })
        }
        const token=authHeader.split(" ")[1]
        const payload=jwt.verify(token,process.env.secretkey)
        req.user=payload
        next()
    }
    catch(err){
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}
module.exports=authmiddleware