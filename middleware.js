import jwt from "jsonwebtoken"

export function verifyToken(req,res,next){
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({error:"Acess denied"});
    try{
        const decoded = jwt.verify(token,"task");
        req.userId = decoded.userId;
        next();
    } catch(error){
        res.status(401).json({message:"unauthorized"})
    }

}