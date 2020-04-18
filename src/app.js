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
const tempChartRoute = require('./routes/temp.chart.route');
const humidityChartRoute = require('./routes/humidity.chart.router')
const pressureChartRoute = require('./routes/pressure.chart.route')


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

app.use('/predict', watherRouter);
app.use('/home', homeRouter);
app.use('/temperature', tempChartRoute)
app.use('/humidity', humidityChartRoute)
app.use('/pressure', pressureChartRoute)

// socketio
io.on('connection', (socket) => {
    socket.join("room-x");
    console.log(socket.id + ' connected');
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnect');
    });
    // send data to Temperature chart
    socket.on("Client-send-temp", async(mess) => {
        // After 1 second the server sends the last 20 records
        setInterval(async() => {
            let data = await require('./controllers/temp.chart.controller').getData();
            socket.emit("Sv-send", data)
        }, 1000)
    })

    socket.on("Client-send-humidity", async(mess) => {
        // After 1 second the server sends the last 20 records
        setInterval(async() => {
            let data = await require('./controllers/temp.chart.controller').getData();
            socket.emit("Sv-send", data)
        }, 1000)
    })

    socket.on("Client-send-pressure", async(mess) => {
        // After 1 second the server sends the last 20 records
        setInterval(async() => {
            let data = await require('./controllers/temp.chart.controller').getData();
            socket.emit("Sv-send", data)
        }, 1000)
    })
});