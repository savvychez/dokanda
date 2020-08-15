const express = require('express');
const router = express.Router();
const pg = require('pg');
const { v4: uuidv4 } = require('uuid');
var sha256 = require('js-sha256');
var client = null
var diseases = []

router.get('/articles', (req, res, next) => {
    res.json({
        "hello": true,
    })
})


router.post('/matching', (req, res, next) => 
{
    //Input is [String text, String language]
    var matchingDiseases = [];
    var langLoc = 0;
    var matched = new Set();
    if(req.body.data[1]==="i")
    {
        langLoc = 1;
    }
    diseases.forEach((d)=>
    {
        var symptoms = d.symptoms
        symptoms.forEach((symptom)=>
        {
            var s = symptom.split("|")[langLoc].toLowerCase();
            if(s.includes(req.body.data[0].toLowerCase()) && !matched.has(d.name))
            {
                matchingDiseases.push(new disease(d.name.split("|")[langLoc].toLowerCase(),d.symptoms.map((s)=>s)));
                matched.add(d.name);
            }
        })
    })
    console.log("AAAAAAAA")

    for(var x=0;x<matchingDiseases.length;x++)
    {
        s = matchingDiseases[x].symptoms;

        for(var i=0;i<s.length;i++)
        {
            s[i] = s[i].split("|")[langLoc].toLowerCase();
        }
    }
    console.log(matchingDiseases)
    res.json({"matchingDiseases":matchingDiseases})
})

router.get("/createUsers",async (req,res,next)=>
{
    const query = "CREATE table users(id SERIAL,firstName text,lastName text,email text,password text, pharmacy text,auth_token text)";
    await client.query(query).then((res) => {console.log(res)}).catch( err => console.log(err))
    console.log("Made Table")
})

router.post("/registerUser",async (req,res,next)=>
{
    var query = "SELECT * FROM users WHERE email=$1";
    var values = [req.body.email]
    var status = true;
    var statusMessage;
    var auth_token = uuidv4();

    await client.query(query,values).then((res) => 
    {
        if(res.rows.length!=0)
        {
            status = false;
            statusMessage = "Email Already Taken"
            auth_token=null;
        }
    }).catch((err) => 
    {
        console.log(err);
        status = false;
        statusMessage = "Error While Registering";
        auth_token=null;
    })

    if(status)
    {
        query = "INSERT INTO users(firstName,lastName,email,password,pharmacy,auth_token) VALUES ($1,$2,$3,$4,$5,$6)";
        values = [req.body.firstName,req.body.lastName,req.body.email,sha256(req.body.password),req.body.pharmacy,auth_token]

        await client.query(query,values).then((res) => 
        {
            console.log(res)
            statusMessage = "Successful Registration"
        }).catch( (err) => 
        {
            console.log(err)
            statusMessage = "Error While Registering"
            auth_token=null;
        })
    }        

    printUsers();

    res.json(
    {
        "statusMessage":statusMessage,
        "auth_token": auth_token
    })
})
router.post("/login",async (req,res,next)=>
{
    var query = "SELECT auth_token FROM users WHERE email=$1 AND password=$2";
    var values = [req.body.email,sha256(req.body.password)]
    var statusMessage = "Unsuccessful Login";
    var auth_token = uuidv4();

    await client.query(query,values).then((res) => 
    {
        if(res.rows.length!=0)
        {
            query = "UPDATE users SET auth_token=$1 WHERE email=$2";
            values = [auth_token,req.body.email]
            await client.query(query,values).then((res) => {statusMessage = "Successful Login"}).catch((err) => 
            {
                console.log(err);
                auth_token=null;
            })
        }
    }).catch((err) => 
    {
        console.log(err)
        auth_token=null;
    })

    printUsers()

    res.json(
    {
        "statusMessage":statusMessage,
        "auth_token": auth_token
    })
})

router.post("/confirmAuthToken",async(req,res,next)=>
{
    var query = "SELECT * FROM users WHERE auth_token=$1";
    var values = [req.body.auth_token]
    var statusMessage = "Invalid Auth Token";

    client.query(query,values).then((res)=>
    {
        if(res.rows.length!=0)
            statusMessage = "Valid Auth Token";
    })

    res.json({"statusMessage":statusMessage})
})

router.post("/logout",async(req,res,next)=>
{
    var query = "UPDATE users SET auth_token=$1 WHERE auth_token=$2";
    var values = [null,req.body.auth_token]
    var statusMessage = "Successful Logout";

    client.query(query,values).then((res)=>{})

    res.json({"statusMessage":statusMessage})
})

const init = ()=>
{
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
    
    clientInstance.connect(async (err) => 
    {
        if (err) 
            console.log(err) ;
        else 
        {
            client = clientInstance;
            await initData(client);
        }
    });
}

const printUsers = async()=>
{
    const query = "SELECT * FROM users";

    await client.query(query).then((res) => 
    {
        res.rows.forEach((row)=>
        {
            console.log(row)
        })
    }).catch
    (
        err => console.log(err)
    )
}

const initData = async (client) =>
{
    const query = "SELECT * FROM diseases";

    await client.query(query).then((res) => 
    {
        res.rows.forEach((row)=>
        {
            // console.log(row.name+" "+row.symptoms)
            diseases.push(new disease(row.name,row.symptoms))
        })
    }).catch
    (
        err => console.log(err)
    )
}

module.exports.router = router;
module.exports.init = init;



function disease(name,symptoms)
{
    this.name=name;
    this.symptoms=symptoms;
}