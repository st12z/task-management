const User = require("../models/user.model");
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");
var md5 = require("md5");
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
      const data = new User(req.body);
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
