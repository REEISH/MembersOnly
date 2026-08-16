const db = require("../db/queries");

exports.getMemberForm = (req, res) => {
  res.render("member", { title: "Become a Member" });
};

exports.verifyMemberAnswer = async (req, res, next) => {
  try {
    const { math_answer } = req.body;
    const SECRET_ANSWER = "5";

    if (math_answer.trim() === SECRET_ANSWER) {
      await db.add_member(req.user.id);
      res.redirect("/log");
    } else {
      res.render("member", {
        title: "Become a Member",
        error: "Incorrect answer.Re-evaluate your isomorphism classes!",
      });
    }
  } catch (error) {
    next(error);
  }
};
