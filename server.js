const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', socket => {
  // socket.on()
})

require('dotenv').config();

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

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});