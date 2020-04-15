require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan')

const io = require('socket.io')
const moongose = require('./config/mongoose');
const watherRouter = require('./routes/weather.route');
const homeRouter = require('./routes/home.route')
const app = express();
const PORT = process.env.PORT;

const server = require('http').Server(app)
app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(express.static('./src/public'))
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(logger('dev'));


app.use('/', watherRouter);
app.use('/home', homeRouter)
moongose.connect();

app.listen(PORT, () => console.log(`app run port = ${PORT}`));