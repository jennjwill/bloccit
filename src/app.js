const express = require("express");
const app = express(); //init app

const routeConfig = require("./config/route-config.js");

routeConfig.init(app);

module.exports = app; //export app so we can pass it to Node server in server.js
