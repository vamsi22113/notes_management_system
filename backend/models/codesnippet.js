const mongoose=require('mongoose')
const codesnippetschema=new mongoose.Schema({
    projectId:{type:mongoose.Schema.Types.ObjectId,
    ref:"project",
    required:true},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    code:{
        type:String,
        required:true
    },
    explanation:{
        type:String,
        required:true
    },
    language:{
        type:String,
        default:"Python"
    },
    mode: {
        type: String,
        default: "beginner"
    },
},{ timestamps: true })
module.exports=mongoose.model("codesnippet",codesnippetschema)