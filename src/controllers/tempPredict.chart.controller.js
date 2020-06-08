const WeatherPredict = require('../models/tempPredict.model')
const Weather = require('../models/weather.model')
module.exports.chartTempPredict = async(req, res, next) => {
    res.render('chart/tempPredict.chart.pug')
}

module.exports.getTempPredict = async() => {
    try {
        const dataPre = await WeatherPredict.find({}, {
            _id: 0,
            __v: 0,
            // temperature: 1,
            // time: 1

        }).sort({
            _id: -1
        }).limit(13)
        const dataHours = await Weather.find({}, {
            _id: 0,
            __v: 0
        }).sort({
            _id: -1
        }).limit(13);
        let data = []

        for (let i = 0; i < 13; i++) {
            let obj = {}
            Object.assign(obj, {
                time: dataPre[i].time,
                temperature: dataPre[i].temperature
            })
            Object.assign(obj, {
                    temp: dataHours[i].temperature
                })
                // console.log(dataPre[i]);


            console.log(obj);
            data.push(obj);
        }

        return data
    } catch (error) {
        return []
    }
}