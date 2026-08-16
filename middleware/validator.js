const { body, validationResult } = require("express-validator");

const validateUserSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", {
        title: "Register",
        errors: errors.array(),
      });
    }
    next();
  },
];

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};

module.exports = {
  validateUserSignUp,
  isAuthenticated,
};
