const mongoose = require("mongoose");
const generate = require("../../../helper/generate");
const userSchema =new mongoose.Schema(
  {
    fullName:String,
    email:String,
    password:String,
    token:{
      type:String,
      default:generate.generate_token(20),
    },
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