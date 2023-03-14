const express = require("express");
const morgan = require("morgan");
const parser = require("body-parser");
const cors = require('cors');

const api = express();
const routes = require("./api/routes/action");

api.use(morgan("dev"));
api.use(parser.urlencoded({extended: false})); // 'extended: false' means that only string values are supported, 
//instead of 'extended: true' that means that json supports more values except only strings
api.use(parser.json());

/*
api.use((request, result, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested_With, Content-Type, Accept, Authorization");
    
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
        return res.status(200).json({});
    }
    next(); // pass control to the next middleware function
});
*/

api.use(cors({
    origin: '*'
}));

api.use("/action", routes);

module.exports = api;
