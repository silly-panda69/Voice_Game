import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import uniqid from 'uniqid';

const socket = io.connect('http://localhost:5000');

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [room, setRoom] = useState('');
  const [join, setJoin] = useState(false);
  const [name,setName]=useState('');
  const [error,setError]=useState('');

  const sendMessage = () => {
    const id=uniqid();
    socket.emit('message', { msg, room ,name, id});
    setMessages([...messages,{ msg, room ,name: 'me', id}]);
    setMsg('');
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setJoin(true);
      setName(uniqid());
      setError('');
      console.log(messages);
    }else{
      setError('Some fields are empty !');
    }
  }

  const exitRoom=()=>{
    setRoom('');
    setName('');
    setJoin(false);
  }

  useEffect(() => {
    socket.on("receive", (data) => {
      setMessages(messages=>[...messages,data]);
      console.log(messages);
    });
  },[]);

  return (
    <div className='d-flex flex-column align-items-center mt-5 gap-3'>
      {join && 
        <div className='d-flex gap-1 fs-4 fw-bold'>
          <p style={{margin: 0}}>Room Code: </p>
          <p style={{margin: 0}}>{room}</p>
        </div>
      }
      {!join &&
        <div className='d-flex flex-column gap-3'>
          <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room Code....." />
          <div className='d-flex justify-content-center'>
            <button className='btn btn-sm btn-outline-success' onClick={() => joinRoom()}>Join</button>
          </div>
          <div className='text-danger d-flex justify-content-center'>
            {error && <p>{error}</p>}
          </div>
        </div>
      }
      {join &&
        <div className='d-flex flex-column justify-content-center gap-3'>
          <div className='d-flex gap-3'>
            <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder='Messages....' />
            <button className='btn btn-sm btn-outline-success' onClick={() => sendMessage()}>Send</button>
            <button className='btn btn-sm btn-outline-success' onClick={() => exitRoom()}>Exit</button>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <p style={{margin: '0'}} className='border-bottom border-dark'>Messages: </p>
          </div>
          <div className='d-flex flex-column justfiy-content-start align-items-start'>
            {messages && messages.map((item) => (
              <div key={item.id} className='pe-3 ps-1 py-1 rounded-3 d-flex gap-2'>
                <p style={{ margin: 0 }} className='fw-bold'>{item.name}:</p>
                <p style={{ margin: 0 }}>{item.msg}</p>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
}


export default HomePage;