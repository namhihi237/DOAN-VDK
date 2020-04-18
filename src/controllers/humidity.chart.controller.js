const Weather_temp = require('../models/weatherTemp.model')


module.exports.chartHumidity = async(req, res, next) => {
    res.render('chart/humidity.chart.pug')
}