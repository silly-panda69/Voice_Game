const express=require('express');
const http=require('http');
const cors=require('cors');
const {Server}=require("socket.io");

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
   cors: {
    origin: '*',
    methods: ["GET","POST"]
   } 
});

app.use(cors());

io.on("connection",(socket)=>{
    console.log(`User connected`);
    socket.on("join_room",(data)=>{
        socket.join(data);
    })
    socket.on('message',(data)=>{
        socket.to(data.room).emit("receive",data);
    });
    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});

server.listen(5000,()=>{
    console.log("Server Started");
});

