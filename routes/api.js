const express = require('express');
const router = express.Router();
const pg = require('pg');

router.get('/articles', (req, res, next) => {
    res.json({
        "hello": true,
    })
})

router.get('/dbtesting', async (req, res, next) => 
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
    
    const client = new pg.Client(config);
    
    client.connect(async (err) => 
    {
        if (err) 
            console.log(err) ;
        else 
        {
            await readData(client);
            await client.end();
        }
    });
})

const readData = async (client) =>
{
    const query = "SELECT * FROM diseases";

    await client.query(query).then((res) => 
    {
        res.rows.forEach((row)=>
        {
            console.log(row.name+" "+row.symptoms)
        })
    }).catch
    (
        err => console.log(err)
    )
}

module.exports = router