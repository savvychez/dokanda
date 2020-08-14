const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const { v4: uuidV4 } = require('uuid')
const request = require('request');
const axios = require('axios')
const { PeerServer } = require('peer');
var queue = [];
PeerServer({port: 3001, path: '/' });

const io = socketio(server)
io.on('connection', socket => {

  socket.on('join-room', (roomId, userId) => {
    //joins room 
    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
    socket.join(roomId)
   
    console.log(userId)
    console.log(roomId)
    //broadcasts connection to other users
    io.to(roomId).emit('user-connected', userId)
    //disconnects user from room
    socket.on('disconnect', () => {
      io.to(roomId).emit('user-disconnected', userId)
    })

  })
})

const enqueue = (roomId)=>
{
    queue.push(roomId);
}
const dequeue = ()=>
{
  return queue.pop(0);
}

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






























// Room ID redirect
app.get('/doctor/chat', (req, res) => {
  res.send(dequeue())
})

app.get('/patient/chat', (req, res) => {
  id = uuidV4()
  enqueue(id);
  res.send(`${id}`)
})

app.get('/doctor/chat:room', (req, res) => {
  res.render('room', {
      roomId: req.params.room
  })
})

app.get('/patient/chat:room', (req, res) => {
  res.render('room', {
      roomId: req.params.room
  })
})
