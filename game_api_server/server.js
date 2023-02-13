require("dotenv").config();
const http = require("http");
const api = require("./api");

const port = process.env.API_PORT || 2555;
const server = http.createServer(api);

server.listen(port);