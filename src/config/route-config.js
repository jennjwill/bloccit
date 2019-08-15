module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    const topicRoutes = require("../routes/topics");
    const advertisementRoutes = require("../routes/advertisements"); //this is the .js file

    app.use(staticRoutes);
    app.use(topicRoutes);
    app.use(advertisementRoutes); //builds routes table, (all 3 of these)
  }
};
