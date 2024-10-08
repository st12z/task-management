const mongoose = require("mongoose");
const taskSchema =new mongoose.Schema(
  {
    title:String,
    status:String,
    content:String,
    createdBy:String,
    timeFinish:Date,
    listUser:Array,
    timeStart:Date,
    taskParentId:String,
    deleted:{
      type:Boolean,
      default:false,
    },
    deleteAt:Date,
  },{
    timestamps:true,
  }
)
const Task = mongoose.model("Task",taskSchema,"tasks");
module.exports=Task;