
const express = require('express');

const path = require('path');
const { Socket } = require('socket.io');

const app = express();

const PORT = process.env.PORT || 4000 ;

const server = app.listen(PORT , ()=> console.log(`server on port ${PORT}`));

const io = require('socket.io')(server);




app.use(express.static(path.join(__dirname, 'public')));

let socketConnected = new Set();

let users = {};

io.on('connection',onConnected );

function onConnected(socket){
    console.log(socket.id);
    socketConnected.add(socket.id);

    io.emit('clients-total', socketConnected.size);
    
    socket.on('new-user-joined',name => {
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
    } );

    socket.on('disconnect', name=>{
        console.log('Socket disconnected', socket.id);
        socket.broadcast.emit('leave',users[socket.id]);
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);

    })

    socket.on('message', (data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data);
    })

    socket.on('audio-message', (data) => {
        console.log('Server received audio-data: ', data);
        io.emit('audio-message', data);
      });
      
      
    // socket.on("audio-message", (data) => {
    //     socket.broadcast.emit("audio-message", data);
    //   });

    socket.on('image', (data) => {
        // Broadcast the image to all connected clients
        io.emit('image', data);
    });
      
}



















// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const PORT = process.env.PORT || 4000;

// app.use(express.static(path.join(__dirname, 'public')));

// let socketConnected = new Set();

// io.on('connection', onConnected);

// function onConnected(socket) {
//   console.log(socket.id);
//   socketConnected.add(socket.id);

//   io.emit('clients-total', socketConnected.size);

//   socket.on('disconnect', () => {
//     console.log('Socket disconnected', socket.id);
//     socketConnected.delete(socket.id);
//     io.emit('clients-total', socketConnected.size);
//   });

//   socket.on('message', (data) => {
//     console.log(data);
//     socket.broadcast.emit('chat-message', data);
//   });

//   socket.on('feedback', (data) => {
//     socket.broadcast.emit('feedback', data);
//   });

//   socket.on('audio-message', (data) => {
//     io.emit('audio-message', data);
//   });
// }

// server.listen(PORT, () => console.log(`Server on port ${PORT}`));

