const project =require("../models/Project.js");
const createProject=async(req,res)=>{
   try{ const{name}=req.body
    const Project=await project.create({
        name:name,
        user:req.user.id
    });
    res.json({
        msg:'project created',
        Project
    })}
    catch(err){
        res.status(500).json({ error: err.message });
    }
}
const getproject=async(req,res)=>{
    try{
        const projects=await project.find({
            user:req.user.id
        })
        res.json(projects)

    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}
module.exports={createProject,getproject}