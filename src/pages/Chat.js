import React, {
  useEffect,
  useState,
  useRef
} from 'react';
import queryString from 'query-string';
import styled from "styled-components";
import io, { Socket } from 'socket.io-client';
import Peer from "simple-peer";
import { useData } from '../components/DataProvider';
import socketIOClient from "socket.io-client";

import '../styles/Chat.css';

import InfoBar from '../components/InfoBar';
import Input from '../components/Input';
import Messages from '../components/Messages'

let socket;

const Chat = ( {location}) => {
  const [stream, setStream] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const {getRoomId, getProf} = useData();

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const userVideo = useRef();
  const partnerVideo = useRef();
  // const socket = useRef();
  const socket = socketIOClient("localhost:3000");
  const ENDPOINT = 'localhost:3000';

  const Video = styled.video `
      border: 1px solid blue;
      width: 50%;
      height: 50%;
  `;

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room },  () => {

    });

    
    return () => {
        socket.emit('discconect');

        socket.off();
    }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
        setMessages([...messages, message]);
    })
  }, [messages])

  const sendMessage = (event) => {
      event.preventDefault();

      if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
      }
  }




  useEffect( () => {
      function roomIdCallback(result)
      {
          const ROOM_ID = result.data;
          const peers = {}
          console.log(ROOM_ID+"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
          // var ROOM_ID = await getRoomId();
          // console.log(ROOM_ID);

          socket.current = io.connect("/");
          const myPeer = new Peer(undefined, {
              host: '/',
              port: '3001'
          })

          myPeer.on('open', id => {
              socket.emit('join-room', ROOM_ID, id)
          })

          socket.on('user-disconnected', userId => {
              if (peers[userId]) 
                  peers[userId].close()
              setCallAccepted(false)
          })

          navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true
          }).then(stream => {
              setStream(stream);
              // if (userVideo.current) {
              userVideo.current.srcObject = stream;

              myPeer.on('call', call => {

                  //respond with stream to existing users
                  call.answer(stream)

                  //get existing partner stream on return
                  call.on('stream', partnerVideoStream => {
                      partnerVideo.current.srcObject = partnerVideoStream;
                      setCallAccepted(true);
                  })
              })

              //user connection response
              socket.on('user-connected', userId => {

                  //send stream to new user
                  const call = myPeer.call(userId, stream)

                  //we get new person's stream
                  call.on('stream', partnerVideoStream => {
                      partnerVideo.current.srcObject = partnerVideoStream;
                      setCallAccepted(true);
                  })

                  peers[userId] = call
              })
          }).catch(error => console.log(error));
      }
      getRoomId(roomIdCallback, getProf)
  }, []);

  let UserVideo;
  if (stream) {
      UserVideo = ( <
          Video playsInline muted ref = { userVideo } autoPlay / >
      );
  }

  let PartnerVideo;
  if (callAccepted) {
      PartnerVideo = ( <
          Video playsInline ref = { partnerVideo } autoPlay / >
      );
  }
  return ( 
      <div>
        <div> 
            { UserVideo } 
            {PartnerVideo} 
        </div>
        <div className="outerContainer">
        <div className="container">
            <InfoBar room={room}/>
            <Messages messages={messages} name={name}/>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        </div>
        </div>
      </div>
      
  );
}

export default Chat;