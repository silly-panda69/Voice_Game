import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const HomePage = () => {
  const [name,setName]=useState("");
  const navigate=useNavigate();
  const handleNavigate=()=>{
    console.log("useNavigate",123);
    if(name){
      navigate(`/room/${name}`);
    }
  }
  return (
    <div className='d-flex flex-column align-items-center justify-content-center vh-100 gap-4'>
      <div className='d-flex flex-column align-items-center'>
        <h1 style={{fontFamily: 'Nova',fontSize: '100px'}}>voice.io</h1>
        <p style={{margin: 0,fontSize: '16px'}}>Speak, Guess, Have Fun, Win</p>
      </div>
      <div className='d-flex flex-column align-items-center gap-3'>
        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className='form-1' placeholder='Name' autoFocus/>
        <button className='btn-1' onClick={handleNavigate}>Play</button>
      </div>
    </div>
  );
}


export default HomePage;