require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const moongose = require('./config/mongoose');
const watherRouter = require('./routes/weather.route');
const homeRouter = require('./routes/home.route');
const chartRouter = require('./routes/chart.route');

const app = express();
// import socket io
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT;



app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(express.static('./src/public'));
app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(logger('dev'));

moongose.connect(); // connect database
server.listen(PORT, () => console.log(`app run port = ${PORT}`));
app.use('/', watherRouter);
app.use('/home', homeRouter);
app.use('/chart', chartRouter)


io.on('connection', (socket) => {
    socket.join("room-x");
    console.log(socket.id + ' connected');
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnect');
    });
    socket.on("Client-send-data", async(mess) => {
        setInterval(async() => {
            let data = await require('./controllers/chart.controller').getData();
            socket.emit("Sv-send", data)
        }, 1000)
    })

});