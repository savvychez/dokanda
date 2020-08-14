import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import styled from "styled-components";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useData } from '../components/DataProvider';
import socketIOClient from "socket.io-client";

const Chat = () => {
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const {getRoomId} = useData();
    const userVideo = useRef();
    const partnerVideo = useRef();
    // const socket = useRef();
    const socket = socketIOClient("localhost:3000");
    const Video = styled.video `
        border: 1px solid blue;
        width: 50%;
        height: 50%;
    `;

    useEffect( () => {
        function roomIdCallback(result){
            const ROOM_ID = result.data;
            const peers = {}
            console.log(ROOM_ID);
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
                if (peers[userId]) peers[userId].close()
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
            })
        }
        getRoomId(roomIdCallback)
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
            { UserVideo } 
            {PartnerVideo} 
        </div>
    );
}

export default Chat;