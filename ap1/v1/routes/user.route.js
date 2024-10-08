const express = require("express");
const router = express.Router();
const authMiddleWare=require("../middlewares/auth.middleware");

const controller = require("../controllers/user.controller");

router.post("/register", controller.register);
router.post("/login",controller.login);
router.post("/password/forgot",controller.forgotPassword);
router.post("/password/otp",controller.otpPassword);
router.post("/password/reset",controller.resetPassword);
router.get("/detail",authMiddleWare.requireAuth,controller.detail);
router.get("/list",authMiddleWare.requireAuth,controller.listUsers);
module.exports=router;