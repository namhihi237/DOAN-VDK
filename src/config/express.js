const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

const watherRouter = require('../routes/weather.route');
const homeRouter = require('../routes/home.route');
const tempChartRoute = require('../routes/temp.chart.route');
const humidityChartRoute = require('../routes/humidity.chart.router');
const pressureChartRoute = require('../routes/pressure.chart.route');
const tempPredictRoute = require('../routes/tempPredict.chart.route');
const chatbotRoute = require('../routes/chatbot.route');
const app = express();

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

app.use('/predict', watherRouter);
app.use('/', homeRouter);
app.use('/temperature', tempChartRoute);
app.use('/humidity', humidityChartRoute);
app.use('/pressure', pressureChartRoute);
app.use('/webhook', chatbotRoute);
app.use('/tempPredict', tempPredictRoute);
module.exports = app