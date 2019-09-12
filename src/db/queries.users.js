const User = require("./models").User;
const Post = require("./models").Post;
const Comment = require("./models").Comment;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },

  getUser(id, callback) {
    let result = {};
    User.findById(id).then(user => {
      if (!user) {
        callback(404);
      } else {
        // store resulting user
        result["user"] = user;
        // execute scope method on Post
        Post.scope({ method: ["lastFiveFor", id] })
          .findAll()
          .then(posts => {
            // store result in result object
            result["posts"] = posts;
            // ex scope on Comment
            Comment.scope({ method: ["lastFiveFor", id] })
              .findAll()
              .then(comments => {
                // store result in result object & pass to callback
                result["comments"] = comments;
                callback(null, result);
              })
              .catch(err => {
                callback(err);
              });
          });
      }
    });
  }
};
