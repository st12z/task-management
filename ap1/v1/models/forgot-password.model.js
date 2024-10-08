const mongoose =require("mongoose");
const forgotPasswordSchema=new mongoose.Schema(
  {
    email:String,
    otp:String,
    expireAt:{
      type:Date,
      expires:360
    },
  },
  {
    timestamps:true,
  }
)
const ForgotPassword = mongoose.model("ForgotPassword",forgotPasswordSchema,"forgotPassword");
module.exports=ForgotPassword;