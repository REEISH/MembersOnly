const bcrypt = require("bcryptjs");
const db = require("../db/queries");

exports.getRegister = (req, res) => {
  res.render("register", { title: "Register" });
};


exports.postRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.add_user(username, hashedPassword);
    req.login(newUser, (err) => {
      if (err) return next(err);
      res.redirect("/log");
    });
  } catch (error) {
    next(error);
  }
};

exports.getSignin = (req, res) => {
  res.render("signin", { title: "Sign In" });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
