const Weather_temp = require('../models/weatherTemp.model')


module.exports.chartPressure = async(req, res, next) => {
    res.render('chart/pressure.chart.pug')
}