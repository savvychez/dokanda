const express = require('express');
const router = express.Router();
const pg = require('pg');
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
    var matchingSymptoms = new Set();
    var langLoc = 0;
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
            if(s.includes(req.body.data[0].toLowerCase()))
                matchingSymptoms.add(s);
        })
    })
    console.log(matchingSymptoms)
    res.json(matchingSymptoms)
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