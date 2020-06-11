const Weather_temp = require('../models/weatherTemp.model')

module.exports.chartTemp = async(req, res, next) => {
    res.render('chart/Temperature.chart.pug')
}

module.exports.chartHumidity = async(req, res, next) => {
    res.render('chart/humidity.chart.pug')
}

module.exports.getData = async() => {
    try {
        const data = await Weather_temp.find({}, {
            temperature: 1,
            humidity: 1,
            pressure: 1,
            rain: 1,
            _id: 0,
            time: 1
        }).sort({
            _id: -1
        }).limit(30)
        return data
    } catch (error) {
        return []
    }
}