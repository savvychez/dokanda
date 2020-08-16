const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const { v4: uuidV4 } = require('uuid')
const request = require('request');
const axios = require('axios')
const path = require('path');
// const { PeerServer } = require('peer');
var queue = [];
// PeerServer({port: 3001, path: '/' });

const { addUser, removeUser, getUser, getUsersinRoom } = require('./users.js');

const io = socketio(server)

const users = {}
// const availableUsers = {}

io.on('connection', socket => {
  socket.on('join', ({ name, room }, callback) => {
    console.log("JOINING: "+socket.id);
    console.log("NEW ROOM: "+room)
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log(name, room);
    if(error) return callback(error);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to your ${"appointment"}`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});

    socket.join(user.room);

    callback();
  });

  socket.on('sendMessage', (name, message, callback) => {
    const user = getUser(socket.id);
    console.log(user);
    console.log("SEND MESSAGE");
    io.to(user.room).emit('message', { user: name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if(user) {
        io.to(user.room).emit('message',{ user: 'admin', text: `${user.name} has left.`})
        io.to(user.room).emit('user-disconnected');
    }


  });

  if(!users[socket.id]){
      users[socket.id] = socket.id;
  }

  // gives everyone the user id
  socket.emit("yourID", socket.id);

  // returns all users
  socket.on('getUsers', () => {
    var user = getUser(socket.id);
    // console.log(users)
    // console.log("THE FUTURE")
    // console.log(Object.keys(io.sockets.sockets))
    

    var clients = io.sockets.adapter.rooms[user.room].sockets;   
    console.log(clients)

    io.to(user.room).emit("allUsers", clients);
  })

  //disconnect users
  socket.on('disconnect', () => {
    delete users[socket.id];
  })

  //calls users
  socket.on("callUser", (data) => {
    // delete users[socket.id];
    socket.broadcast.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  })

  //return acceptance
  socket.on("acceptCall", (data) => {
    // delete users[socket.id];
    io.to(data.to).emit('callAccepted', data.signal);
  })
})

const enqueue = (roomId)=>
{
    queue.push(roomId);
}
const dequeue = ()=>
{
  return queue.shift()
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


//static files connection
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
  apiRoute.init()
});


























// Room ID redirect
app.get('/doctor/chat', (req, res) => {
  res.send(dequeue())
})

app.get('/patient/chat', (req, res) => {
  var id = uuidV4()
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
