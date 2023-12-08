const express=require('express');
const http=require('http');
const cors=require('cors');
const {Server}=require("socket.io");
const {ExpressPeerServer}=require("peer");

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
   cors: {
    origin: '*',
   }
});
const customGenerationFunction = () =>(Math.random().toString(36) + "0000000000000000000").substr(2, 16);
const peerServer=ExpressPeerServer(server,{
    debug: true,
    port: 5000,
    generateClientId: customGenerationFunction,
    cors: {
        origin: '*',
    }
});

app.use('/peerjs',peerServer);
app.use(cors());

peerServer.on('connection', (client) => {console.log('Peer js connected!')});

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`);
    socket.on("join_room",(data)=>{
        console.log("Joined");
        socket.join(data);
    })
    socket.on("send_id",(data)=>{
        socket.to(data.room).emit("receive_id",data.id);
    })
    socket.on('message',(data)=>{
        console.log(data);
        socket.to(data.room).emit("receive",data);
    });
    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
    socket.on('count',(data)=>{
        const user=io.engine.clientsCount;
        socket.to(data.room).emit("count_user",user);
    })
    socket.on('get_ready',(data)=>{
        socket.to(data.room).emit('i_ready',socket.id);
    })
});

server.listen(5000,()=>{
    console.log("Server Started");
});

