const express = require("express");
const morgan = require("morgan");
const parser = require("body-parser");

const api = express();
const routes = require("./api/routes/action");

api.use(morgan("dev"));
api.use(parser.urlencoded({extended: false}));
api.use(parser.json());

api.use("/action", routes);

module.exports = api;