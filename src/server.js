const app = require("./app"); //import app
const http = require("http"); //import http module
const server = http.createServer(app); //create server

server.listen(3000);

server.on("listening", () => {
  console.log("server is listening for requests on port 3000");
});
