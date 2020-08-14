import React, { useEffect, useState, useRef } from 'react';
import styled from "styled-components";
import io from "socket.io-client";

const Chat = () => {

    
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const userVideo = useRef();
    const docVideo = useRef();
    const socket = useRef();

    const Video = styled.video `
        border: 1px solid blue;
        width: 50%;
        height: 50%;
    `;

    useEffect(() => {
        socket.current = io.connect("/");
    }, []);

    let UserVideo;
    if (stream) {
      UserVideo = (
        <Video playsInline muted ref={userVideo} autoPlay />
      );
    }
  
    let DocVideo;
    if (callAccepted) {
      DocVideo = (
        <Video playsInline ref={docVideo} autoPlay />
      );
    }  
    return (
        <div>
            {UserVideo}
            {DocVideo}
        </div>
    );
}

export default Chat;