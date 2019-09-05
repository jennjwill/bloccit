const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {
  /* new() {
    return this.new();
  }

  create() {
    return this.new();
  } */

  edit() {
    return this._isAdmin();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
};
