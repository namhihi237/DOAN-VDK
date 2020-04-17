const Weather_temp = require('../models/weatherTemp.model')

module.exports.chartTemp = async(req, res, next) => {
    res.render('chart/Temperature.chart.pug')
}

module.exports.getData = async() => {
    const data = await Weather_temp.find({}, {
        temperature: 1,
        // humidity: 1,
        // pressure: 1,
        // rain: 1,
        _id: 0,
    }).sort({
        _id: -1
    }).limit(20)
    return data
}