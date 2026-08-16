const db = require("../db/queries");

exports.getLog = async (req, res, next) => {
  try {
    const messages = await db.get_all_posts();
    res.render("log", {
      title: "Math Club Log",
      messages: messages,
    });
  } catch (error) {
    next(error);
  }
};

exports.postMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const authorId = req.user.id;
    const date = new Date();
    await db.add_post(content, authorId, date);
    res.redirect("/log");
  } catch (error) {
    next(error);
  }
};
