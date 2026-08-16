const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");
const memberController = require("../controllers/memberController");
const { isAuthenticated } = require("../middleware/validator");
const { validateUserSignUp } = require("../middleware/validator");

router.get("/", (req, res) => {
  res.render("index", { title: "Math Club Directory" });
});

router.get("/register", authController.getRegister);
router.post("/register", validateUserSignUp, authController.postRegister);

router.get("/signin", authController.getSignin);
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/log",
    failureRedirect: "/signin",
    failureMessage: true,
  }),
);
router.get("/logout", authController.logout);

router.get("/log", isAuthenticated, messageController.getLog);
router.post("/log", isAuthenticated, messageController.postMessage);

router.get("/member", isAuthenticated, memberController.getMemberForm);
router.post("/member", isAuthenticated, memberController.verifyMemberAnswer);

module.exports = router;
