const Advertisement = require("./models").Advertisement;

module.exports = {
  getAllAds(callback) {
    return Advertisement.all()
      .then(advertisements => {
        callback(null, advertisements);
      })
      .catch(err => {
        callback(err);
      });
  }
};
