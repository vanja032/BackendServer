const express = require("express");
const crypto = require("crypto");
const ssh_client = require("simple-ssh")


const router = express.Router();

const algorithm = "aes-256-cbc"; //Length of key is 256b / 8 = 32 bytes
const initialization_vector = "someiv"; //Length of iv must be 16 bytes (16 characters)
const security_key = "somekey"; //Length of key must be 32 bytes (32 characters)

const ssh_config = {
    host: "<vps host>",
    user: "<vps user>",
    port: 22,
    pass: "<vps password>"
};


router.post("/push_action", (request, result, next) => {
    const cypher = crypto.createDecipheriv(algorithm, security_key, initialization_vector);
    let data = cypher.update(request.body.request, "hex", "utf-8");
    data += cypher.final("utf-8");

    const action = {type: data.type, name: data.action_name, data: data.data};
    if(action.type != undefined && action.type != null && action.type == process.env.PUSH_ACTION){
        
		var ssh = new ssh_client(ssh_config);
		ssh.exec("ls -la", {
			out: function (stdout) { console.log(stdout); },
			err: function (stderr) { console.log(stderr); },
			exit: function (code) { console.log(code); }
		}).start();
		
        result.status(201).json({
            message: "Successful POST request to ACTION Api.",
            output: action
        });
    }

    result.status(403).json({
        error: {
            message: "Unauthorized Api action."
        }
    });
});

module.exports = router;