const postFlairs = require("../db/queries.flairs.js");

module.exports = {
  new(req, res, next) {
    res.render("flairs/new", { postId: req.params.postId });
  }
};
