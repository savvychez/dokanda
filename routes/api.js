const express = require('express');
const router = express.Router();
const pg = require('pg');
const { v4: uuidv4 } = require('uuid');
var sha256 = require('js-sha256');
const { restart } = require('nodemon');
const translate = require('@k3rn31p4nic/google-translate-api');
var client = null
var diseases = []

router.get('/articles', (req, res, next) => {
    res.json({
        "hello": true,
    })
})


router.post('/matching', (req, res, next) => {
    //Input is [String text, String language]
    var matchingDiseases = [];
    var langLoc = 0;
    var matched = new Set();
    if (req.body.data[1] === "i") {
        langLoc = 1;
    }
    diseases.forEach((d) => {
        var symptoms = d.symptoms
        symptoms.forEach((symptom) => {
            var s = symptom.split("|")[langLoc].toLowerCase();
            if (s.includes(req.body.data[0].toLowerCase()) && !matched.has(d.name)) {
                matchingDiseases.push(new disease(d.name.split("|")[langLoc].toLowerCase(), d.symptoms.map((s) => s)));
                matched.add(d.name);
            }
        })
    })
    // console.log("AAAAAAAA")

    for (var x = 0; x < matchingDiseases.length; x++) {
        let s = matchingDiseases[x].symptoms;

        for (var i = 0; i < s.length; i++) {
            s[i] = s[i].split("|")[langLoc].toLowerCase();
        }
    }
    // console.log(matchingDiseases)
    res.json({ "matchingDiseases": matchingDiseases })
})

router.get("/createUsers", async (req, res, next) => {
    const query = "CREATE table users(id SERIAL,firstName text,lastName text,email text,password text, pharmacy text,profession text,auth_token text)";
    await client.query(query).then((res) => { console.log(res) }).catch(err => console.log(err))
    console.log("Made Table")
})

router.post("/registerUser", async (req, res, next) => {
    var query = "SELECT profession FROM users WHERE email=$1";
    var values = [req.body.email]
    var status = true;
    var statusMessage;
    var auth_token = uuidv4();

    await client.query(query, values).then((res) => {
        if (res.rows.length != 0) {
            status = false;
            statusMessage = "Email Already Taken"
            auth_token = null;
        }
    }).catch((err) => {
        console.log(err);
        status = false;
        statusMessage = "Error While Registering";
        auth_token = null;
    })

    let sCode;

    if (status) {
        query = "INSERT INTO users(firstName,lastName,email,password,pharmacy,profession,auth_token) VALUES ($1,$2,$3,$4,$5,$6,$7)";
        values = [req.body.firstName, req.body.lastName, req.body.email, sha256(req.body.password), req.body.pharmacy, req.body.profession, auth_token]

        await client.query(query, values).then((res) => {
            console.log(res)
            sCode = 200
            statusMessage = "Successful Registration"
        }).catch((err) => {
            console.log(err)
            sCode = 401
            statusMessage = "Error While Registering"
            auth_token = null;
        })
    }

    printUsers();

    res.json(
        {
            "statusMessage": statusMessage,
            "auth_token": auth_token
        })
    res.status(sCode)
})
router.post("/login", async (req, res, next) => {
    var query = "SELECT profession FROM users WHERE email=$1 AND password=$2";
    var values = [req.body.email, sha256(req.body.password)]
    var success = false;
    var auth_token = uuidv4();
    var prof = null;

    await client.query(query, values).then(async (res) => {
        if (res.rows.length != 0) {
            prof = res.rows[0];
            query = "UPDATE users SET auth_token=$1 WHERE email=$2";
            values = [auth_token, req.body.email]
            await client.query(query, values).then((res) => { success = true }).catch((err) => {
                console.log(err);
                auth_token = null;
            })
        }
        else
            auth_token = null;
    }).catch((err) => {
        console.log(err)
        auth_token = null;
    })

    printUsers()

    res.json(
        {
            "success": success,
            "auth_token": auth_token,
            "prof":prof
        })
})

router.post("/confirmAuthToken", async (req, res, next) => {
    var query = "SELECT profession FROM users WHERE auth_token=$1";
    var values = [req.body.auth_token]
    var statusMessage = "Invalid Auth Token";
    var success = false;
    var prof = null;

    await client.query(query, values).then((res) => {
        // console.log(res.rows.length)
        if (res.rows.length !== 0) {
            statusMessage = "Valid Auth Token";
            success = true;
            prof = res.rows[0]
        }
    })

    res.json({ "statusMessage": statusMessage, "success": success , "prof":prof})
})

router.post("/logout", async (req, res, next) => {
    var query = "UPDATE users SET auth_token=$1 WHERE auth_token=$2";
    var values = [null, req.body.auth_token]
    var success = true;
    console.log(client)
    await client.query(query, values).then((res) => { })
    res.json({ "success": success })
})


router.post("/userDescription", async (req, res, next) => {
    var query = "SELECT id,firstName,lastName,email,pharmacy,profession,auth_token FROM users WHERE auth_token=$1";
    var values = [req.body.auth_token]
    var statusMessage = "Unsuccessful Retreival";
    var description = null;
    await client.query(query, values).then((res) => {
        description = res.rows[0]
        statusMessage = "Successful Retreival"
    }).catch((err) => { console.log(err) })

    res.json(
        {
            "description": description,
            "statusMessage": statusMessage
        })
})

router.post("/translate", async (req, res, next) => {
    var text = req.body.text;
    if(req.body.lang==="e")
    {
        translate(text, {to: 'en' }).then(result => {
            res.json({ "text": result.text });
        }).catch(err => {
            res.json({ "error": err });
        });
    }
    else
    {
        translate(text, {to: 'id' }).then(result => {
            res.json({ "text": result.text });
        }).catch(err => {
            res.json({ "error": err });
        });
    }
})

const init = () => {
    const config = {
        host: 'ec2-52-72-34-184.compute-1.amazonaws.com',
        user: 'mimsvndxbgrmep',
        password: '01752f23d29059300fbb6b0a4d3eb3337dabc23780deffe5e5d3bad88adc3ddb',
        database: 'dbsfa958kpt335',
        port: 5432,
        ssl: true,
        ssl: { rejectUnauthorized: false },
        rejectUnauthorized: false
    };

    const clientInstance = new pg.Client(config);

    clientInstance.connect(async (err) => {
        if (err)
            console.log(err);
        else {
            // console.log(clientInstance)
            client = clientInstance;
            await initData(client);
        }
    });
    // console.log(client);
}

const printUsers = async () => {
    const query = "SELECT * FROM users";

    await client.query(query).then((res) => {
        res.rows.forEach((row) => {
            // console.log(row)
        })
    }).catch
        (
            err => console.log(err)
        )
}

const initData = async (client) => {
    const query = "SELECT * FROM diseases";

    await client.query(query).then((res) => {
        res.rows.forEach((row) => {
            // console.log(row.name+" "+row.symptoms)
            diseases.push(new disease(row.name, row.symptoms))
        })
    }).catch
        (
            err => console.log(err)
        )
}

module.exports.router = router;
module.exports.init = init;



function disease(name, symptoms) {
    this.name = name;
    this.symptoms = symptoms;
}