const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())

const apiRoute = require('./routes/api');
app.use('/api', apiRoute)

app.use((err, req, res, next) => {
    console.log(err)
    next();
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});