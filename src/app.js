require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});

const moongose = require('./config/mongoose');
const app = require('../src/config/express');
// import socket io

const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT;


moongose.connect();
server.listen(PORT, () => console.log(`app run port = ${PORT}`));

// socketio
io.on('connection', (socket) => {
    socket.join('room-x');
    console.log(socket.id + ' connected');
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnect');
    });
    // send data to Temperature chart
    socket.on('Client-send-temp', async(mess) => {
        // After 1 second the server sends the last 20 records
        setInterval(async() => {
            let data = await require('./controllers/temp.chart.controller').getData();
            socket.emit('Sv-send', data);
        }, 1000);
    });
    // send data to humidity chart
    socket.on('Client-send-humidity', async(mess) => {
        // After 1 second the server sends the last 20 records
        setInterval(async() => {
            let data = await require('./controllers/temp.chart.controller').getData();
            socket.emit('Sv-send', data);
        }, 1000);
    });
    // send data to pressure chart
    socket.on('Client-send-pressure', async(mess) => {
        // After 1 second the server sends the last 20 records
        setInterval(async() => {
            let data = await require('./controllers/temp.chart.controller').getData();
            socket.emit('Sv-send', data);
        }, 1000);
    });
});