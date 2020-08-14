const express = require('express');
const router = express.Router();
const pg = require('pg');
var client = null
var diseases = []
var queue = [];

router.get('/articles', (req, res, next) => {
    res.json({
        "hello": true,
    })
})

router.post('/dequeue', (req, res, next) => {
    res.json({"roomCode":queue.pop(0)});
})
router.get('/enqueue', (req, res, next) => {
    queue.push(req.body.roomCode);
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