const express=require("express")
const route=express.Router()
const authmiddleware=require("../middlewares/authmiddleware")
const {createProject,getproject}=require('../controllers/projectController')
route.post('/create',authmiddleware,createProject)
route.get("/projects",authmiddleware,getproject)
module.exports=route