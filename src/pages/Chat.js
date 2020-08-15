import React, {
  useEffect,
  useState,
  useRef
} from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import queryString from 'query-string'; 

import Messages from '../components/Messages';
import InfoBar from '../components/InfoBar';
import Input from '../components/Input';
import {useData} from '../components/DataProvider';

// import '../styles/Chat.css';


const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

//   const { getRoomId }  = useData();

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

    
  useEffect(() => {
    
    const { name, room } = queryString.parse(location.search);

    
    console.log(name, room);

    //socket connection
    socket.current = io.connect("/");

    //save to name and room
    setName(name);
    // room_id = room_id.data;
    setRoom(room);

    // getting audio/video
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    

    // received call from new user
    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })

    socket.current.emit('join', { name, room },  () => {
        console.log("hello");
        
    });

    // set personal id upon receiving id
    socket.current.on("yourID", (id) => {
        setYourID(id);
    })

    // gets list of users in database
    socket.current.emit("getUsers");
    socket.current.on("allUsers", (users) => {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      setUsers(users);
      console.log(users)
    })

    return () => {
        socket.current.emit('disconnect');

        socket.current.off();
    }
  }, []);

  useEffect(() => {
    socket.current.on('message', (message) => {
        setMessages([...messages, message]);
    })
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
        socket.current.emit('sendMessage', message, () => setMessage(''));
    }
  }

  // call peer upon button click (Show user is calling)
  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    // sends signal for callUser
    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    // receive stream from partner
    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    //send signal to caller for call accepted
    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    // peer accepts call
    setCallAccepted(true);

    // peer
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    // peer receives signal for call accept
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    // received stream from partner
    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    // send reception of call
    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall && !callAccepted) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }
  return (
      <div>
          <Container>
            <Row>
                {UserVideo}
                {PartnerVideo}
            </Row>
            <Row>
                {Object.keys(users).map(key => {
                if (key === yourID) {
                    return null;
                }
                if(!callAccepted)
                {
                    return (
                        <button onClick={() => callPeer(key)}>Call {key}</button>
                    );
                }
                })}
            </Row>
            <Row>
                {incomingCall}
            </Row>
            <Row>
            <div className="outerContainer">
                    <div className="container">
                        <InfoBar room={room}/>
                        <Messages messages={messages} name={name}/>
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                    </div>
                </div>
            </Row>
            </Container>
      </div>
    
  );
}

export default Chat;