import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import socket from '../SocketConfig';
import {Peer, PeerError} from 'peerjs';

const GamePage = () => {
    const [peerData,setpeerData]=useState(null);
    const [mediaStream,setMediaStream]=useState(null); //user stream data
    const [peerStream,setPeerStream]=useState(null);
    const [peerId,setPeerId]=useState(null);
    const [userId,setUserId]=useState(null);
    const [ready,setReady]=useState(null);
    const audioRef=useRef(null);
    const audioRef2=useRef(null);
    const [data1,setData1]=useState("");

    useEffect(()=>{
        socket.emit("join_room",123);
        socket.on("receive_id",(data)=>{
            setPeerId(data);
        });
        socket.on("i_ready",(data)=>{
            setReady(data);
        })
    },[]);

    useEffect(()=>{
        sendUserId();
        micOn();
        socket.on('connect',()=>{
            const peer=new Peer({
                debug: 3,
                host: 'voice-game-server.onrender.com',
                port: 443,
                path: '/peerjs',
            });
            peer.on('open',function(id){
                socket.emit("send_id",{room: 123,id: id});
                setUserId(id);
            });
            setpeerData(peer);
            peer.on("call",(call)=>{
                call.answer(mediaStream);
                call.on('stream',(remoteStream)=>{
                    audioRef2.current.srcObject=remoteStream;
                    audioRef2.current.play();
                    console.log(remoteStream);
                    console.log('Remote Stream');
                })
            });
        })
    },[]);

    const startCall=()=>{
        try{
            const call=peerData.call(data1,mediaStream);
            console.log(mediaStream);
            try{
                socket.emit('get_ready',{room: 123,id: "ready"})
                call.on("stream",(remoteStream)=>{
                    // audioRef.current.srcObject=remoteStream;
                    console.log('Local Stream');
                    socket.emit('get_ready',{room: 123,id: "ready"})
                });
            }catch(err){
                console.log(err);
            }
        }catch(err){
            console.log(err);
        }
    }

    const answerCall=()=>{
        try{
            peerData.on("call",(call)=>{
                call.answer(mediaStream);
                call.on('stream',(stream)=>{
                    audioRef.current.srcObject=stream;
                    console.log('Remote Stream');
                })
            });
            console.log('Call picked');
        }catch(err){
            console.log(err);
        }
    }

    const micOn=async()=>{
        const stream=await navigator.mediaDevices.getUserMedia({audio: true});
        setMediaStream(stream);
        console.log("Mic on");
    }

    const micOff=()=>{
        mediaStream.getTracks().forEach((tracks)=>{
            tracks.stop();
        });
        audioRef.current.srcObject=null;
        setMediaStream(null);
        console.log("Mic off");
    }

    const sendUserId=()=>{
    }
            
    return (
        <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
            <h3>Mine: {userId}</h3>
            <h3>Friend: {peerId}</h3>
            <div className='d-flex gap-3'>
                <button className='btn btn-sm btn-success' onClick={()=>startCall()}>Call</button>
                <button className='btn btn-sm btn-danger' onClick={()=>answerCall()}>Answer</button>
                {mediaStream && <button className='btn btn-sm btn-dark' onClick={()=>micOff()}>On</button>}
                {!mediaStream && <button className='btn btn-sm btn-dark' onClick={()=>micOn()}>Off</button>}
            </div>
            <audio style={{display:"none"}} controls ref={audioRef} autoPlay></audio>
            <audio style={{display:"none"}} controls ref={audioRef2} autoPlay></audio>
            {ready && <p>Someone is calling....</p>}
            <input type="text"  value={data1} onChange={e=>setData1(e.target.value)}/>
        </div>
    );
}
 
export default GamePage;
