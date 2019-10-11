const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {};

//conexão com o BD
mongoose.connect('mongodb+srv://luck:luck157@cluster0-jyby7.mongodb.net/aircnc?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//IO functions
io.on('connection', socket=>{
    const { user_id } = socket.handshake.query;
    connectedUsers[user_id] = socket.id;

    socket.on('disconnect', ()=>{
        delete connectedUsers[user_id];
    })
});
//IO middleware
app.use((req, res, next)=>{
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next(); 
});
//middlewares
app.use(cors())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(express.json());

//routes
app.use(routes);

//listen
server.listen(3333);