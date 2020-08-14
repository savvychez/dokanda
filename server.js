const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const request = require('request');
const axios = require('axios')

io.on('connection', socket => {

  socket.on('join-room', (roomId, userId) => {
    //joins room
    socket.join(roomId)

    //broadcasts connection to other users
    socket.to(roomId).broadcast.emit('user-connected', userId)

    //disconnects user from room
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })

  })
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
app.use('/api', apiRoute.router)

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
  apiRoute.init()
});