require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});

const moongose = require('./config/mongoose');
const app = require('../src/config/express');
// import socket io
const getData = require('./controllers/temp.chart.controller');
const getTempPredict = require('./controllers/tempPredict.chart.controller');
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
        let data = await getData.getData();
        socket.emit('Sv-send', data);
    });
    // send data to humidity chart
    socket.on('Client-send-humidity', async(mess) => {
        let data = await getData.getData();
        socket.emit('Sv-send', data);
    });
    // send data to pressure chart
    socket.on('Client-send-pressure', async(mess) => {
        let data = await getData.getData();
        socket.emit('Sv-send', data);
    });

    socket.on('Client-send-tempPredict', async(mess) => {
        let data = await getTempPredict.getTempPredict(); // need fix

        socket.emit('Sv-send', data);
    })
});

exports.io = io;