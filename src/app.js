const express = require("express");
const app = express(); //init app

const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

appConfig.init();
routeConfig.init(app, express);

module.exports = app; //export app so we can pass it to Node server in server.js
