const User = require("../models/user.model");
const generateHepler=require("../../../helper/generate");
var md5 = require("md5");
const ForgotPassword = require("../models/forgot-password.model");
const sendEmailHepler=require("../../../helper/sendMail");
// [GET] /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    console.log(req.body);
    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({ email: req.body.email });
    if (existEmail) {
      res.json({
        code: 400,
        message: "Email đã tồn tại!",
      });
    } else {
      const data = new User({
        fullName:req.body.fullName,
        password:req.body.password,
        email:req.body.email,
        token:generateHepler.generate_token(10)
      });
      res.cookie("token", data.token);
      await data.save();
      res.json({
        code: 200,
        message: "Đăng kí thành công!",
        token: data.token,
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const existEmail = await User.findOne({ email: email, deleted: false });
    if (!existEmail) {
      res.json({
        code: 400,
        email: "Không tồn tại",
      });
      return;
    }
    if (md5(password) != existEmail.password) {
      res.json({
        code: 400,
        email: "Sai mật khẩu!",
      });
      return;
    }
    const token=existEmail.token;
    res.cookie("token",token);
    res.json({
      code:200,
      message:"Đăng nhập thành công!",
      token:token
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email, deleted: false });
    if (!user) {
      res.json({
        code: 400,
        email: "Không tồn tại",
      });
      return;
    }
    const otp=generateHepler.generate_Otp(6);
    const objectForgotPassword={
      email:email,
      otp:otp,
      expireAt:Date.now()
    }
    console.log(objectForgotPassword);
    const forgotPassword=new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    const subject="Mã xác minh OTP";
    const html=`Mã xác minh OTP của bạn là <b>${otp}</b>`;
    sendEmailHepler.sendMail(email,subject,html);
    res.json({
      code:200,
      messange:"Đã gửi mã otp đến email"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp =req.body.otp;
    const result=await ForgotPassword.findOne({email:email,otp:otp});
    if(!result){
      res.json({
        code:400,
        messange:"Đã nhập sai mã OTP!"
      })
      return;
    }
    const user=await User.findOne({email:email});
    res.cookie("token",user.token);
    console.log(email,otp);
    res.json({
      code:200,
      messange:"Mã OTP hợp lệ!",
      token:user.token
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
   
    const token =req.body.token;
    const password=req.body.password;
    const user=await User.findOne({token:token,deleted:false});
    if(!user){
      res.json({
        code:400,
        messange:"Không tồn tại!"
      })
      return;
    }
    user.password=md5(password);
    await user.save();
    res.json({
      code:200,
      messange:"Đã thay đổi mật khẩu thành công!",
      token:user.token
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
  try {
 
    res.json({
      code:200,
      message:"Thông tin đã gửi!",
      user:req.user
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
// [GET] /api/v1/users/list
module.exports.listUsers = async (req, res) => {
  try {
    const listUsers=await User.find().select("fullName email");
    res.json({
      code:200,
      message:"Thông tin đã gửi!",
      listUsers:listUsers
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};