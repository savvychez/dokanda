import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import styled from "styled-components";
import io from "socket.io-client";
import Peer from "peerjs";
import { useData } from '../components/DataProvider';
import socketIOClient from "socket.io-client";

const Chat = () => {
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const {getRoomId, getProf} = useData();
    
    const userVideo = useRef();
    const partnerVideo = useRef();
    // const socket = useRef();
    const socket = io("/");
    socket.on('connect', function(socket) {
        console.log('Connected!');
    });
    
    const Video = styled.video `
        border: 1px solid blue;
        width: 50%;
        height: 50%;
    `;
    useEffect(()=>{})
    // useEffect( () => {
        function roomIdCallback(result)
        {
            const ROOM_ID = result.data;
            const peers = {}
            console.log(result.data);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");

            // var ROOM_ID = await getRoomId();
            // console.log(ROOM_ID);

            const myPeer = new Peer(undefined, {
                host: '/',
                port: '3001',
            })
            console.log(myPeer)
            myPeer.on('open', id => {
                console.log("FFFFFFFFFFFFFFFFFFFFFFFFFF")
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
                userVideo.current.srcObject = stream;

                myPeer.on('call', call => {
                    console.log("BBBBBBBBBBBBBBBBBB")
                    //respond with stream to existing users
                    call.answer(stream)

                    //get existing partner stream on return
                    call.on('stream', partnerVideoStream => {
                        partnerVideo.current.srcObject = partnerVideoStream;
                        
                        setCallAccepted(true);
                    })
                    
                })                
                console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV")

                socket.on('user-connected', userId => 
                    {
                        console.log("CCCCCCCCCCCCCCCCCCCC")
                        //send stream to new user
                        console.log("STREAM ")
                        console.log(stream)
                        const call = myPeer.call(userId, stream)

                        //we get new person's stream
                        call.on('stream', partnerVideoStream => {
                            partnerVideo.current.srcObject = partnerVideoStream;
                        

                            setCallAccepted(true);
                    })

                    peers[userId] = call
                    })
                console.log("LLLLLLLLLLLLLLLLLLLLLLLLLL")

                //user connection response
                
            }).catch(error => console.log(error));
        }
        getRoomId(roomIdCallback)
    // }, []);
    // useEffect(() => {
    //     socket.on('user-connected', userId => {
    //         console.log("CCCCCCCCCCCCCCCCCCCC")

    //         })
    // }, [])

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