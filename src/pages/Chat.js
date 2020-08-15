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

import '../styles/Chat.css';


const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
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

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

    
  useEffect(() => {
    
    const { name, room } = queryString.parse(location.search);
    console.log(name, room);

    socket.current = io.connect("/");

    setName(name);
    setRoom(room);

    socket.current.emit('join', { name, room },  () => {
        console.log("hello");
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })

    return () => {
        socket.emit('discconect');

        socket.off();
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


  console.log(message, messages);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {

    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

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
            </Container>
            <Container>
                <div className="outerContainer">
                    <div className="container">
                        <InfoBar room={room}/>
                        <Messages messages={messages} name={name}/>
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                    </div>
                </div>
    </Container>
      </div>
    
  );
}

export default Chat;