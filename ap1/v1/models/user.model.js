const mongoose = require("mongoose");
const userSchema =new mongoose.Schema(
  {
    fullName:String,
    email:String,
    password:String,
    token:String,
    avatar:String,
    status:{
      type:String,
      default:"active"
    },
    phone:String,
    address:String,
    deleted:{
      type:Boolean,
      default:false,
    },
    deleteAt:Date
  },{
    timestamps:true,
  }
)
const User = mongoose.model("User",userSchema,"users");
module.exports=User;