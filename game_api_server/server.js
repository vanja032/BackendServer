require("dotenv").config();
const https = require("https");
const fs = require("fs");

const api = require("./api");

const port = process.env.API_PORT || 2555;
const host = process.env.API_HOST || "0.0.0.0";

//SSL Certificate files location
const options = {
    key: fs.readFileSync("<private key file path>"),
    cert: fs.readFileSync("<certificate file path>"),
};

const server = https.createServer(options, api);

server.listen(port, host);