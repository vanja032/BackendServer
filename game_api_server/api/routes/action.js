const express = require("express");
const crypto = require("crypto");
const ssh_client = require("simple-ssh")


const router = express.Router();

const algorithm = process.env.ALGORITHM;
const initialization_vector = process.env.IV;
const security_key = process.env.SECURITY_KEY;

const ssh_config = {
    host: process.env.SSH_HOST,
    user: process.env.SSH_USER,
    port: process.env.SSH_PORT,
    pass: process.env.SSH_PASSWORD
};

/* router.post("/get_action", (request, result, next) => {
    const cypher = crypto.createCipheriv(algorithm, security_key, initialization_vector);
    let data = cypher.update(JSON.stringify(request.body), "utf-8", "base64");
    data += cypher.final("base64");

    result.status(200).json({
        message: "Successful POST request to ACTION Api.",
        output: data
    });
}); */

router.post("/push_action", (request, result, next) => {
    const cypher = crypto.createDecipheriv(algorithm, security_key, initialization_vector);
    let data = cypher.update(request.body.request, process.env.ENCRYPTION_FORMAT, "utf-8");
    data += cypher.final("utf-8");
    data = JSON.parse(data);
    
    const action = {type: data.type, name: data.action_name, account_name: data.account, data: data.data};
    if(action.type == process.env.PUSH_ACTION && action.name == process.env.INSERT_SCORE){
        var ssh = new ssh_client(ssh_config);
        ssh.exec(`<path to cline>/cline push action ${action.account_name} ${action.name} '["${action.data.username}", ${action.data.score}, ${action.data.coins}]' -p ${action.account_name}@active`, {
            out: function (stdout) { console.log(stdout); },
            error: function (stder) { console.log("aa"); }
        }).start();

        result.status(201).json({
            message: "Successful POST request to ACTION Api.",
            output: action
        });
    }
    else{
        result.status(403).json({
            error: {
                message: "Unauthorized Api action."
            }
        });
    }
});

router.put("/push_action", (request, result, next) => {
    const cypher = crypto.createDecipheriv(algorithm, security_key, initialization_vector);
    let data = cypher.update(request.body.request, process.env.ENCRYPTION_FORMAT, "utf-8");
    data += cypher.final("utf-8");
    data = JSON.parse(data);
    
    const action = {type: data.type, name: data.action_name, account_name: data.account, data: data.data};
    if(action.type == process.env.PUSH_ACTION && action.name == process.env.INSERT_SCORE){
        var ssh = new ssh_client(ssh_config);
        ssh.exec(`<path to cline>/cline push action ${action.account_name} ${action.name} '["${action.data.username}", ${action.data.score}, ${action.data.coins}]' -p ${action.account_name}@active`, {
            out: function (stdout) { console.log(stdout); },
            error: function (stder) { console.log(stder); }
        }).start();

        result.status(201).json({
            message: "Successful PUT request to ACTION Api.",
            output: action
        });
    }
    else{
        result.status(403).json({
            error: {
                message: "Unauthorized Api action."
            }
        });
    }
});

module.exports = router;