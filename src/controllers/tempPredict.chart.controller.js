const WeatherPredict = require('../models/tempPredict.model');
const Weather = require('../models/weather.model');
module.exports.chartTempPredict = async(req, res, next) => {
    const temp = await WeatherPredict.find().sort({
        _id: -1
    }).limit(1);
    console.log(temp[0]);

    res.render('chart/tempPredict.chart.pug', {
        temp: `Nhiệt độ dự đoán vào lúc ${temp[0].time.getHours()} giờ là : ${temp[0].temperature} `

    });
};

module.exports.getTempPredict = async() => {
    try {
        const dataPre = await WeatherPredict.find({}, {
                _id: 0,
                __v: 0,
            }, )
            .sort({
                _id: -1,
            })
            .limit(13);

        const dataHours = await Weather.find({}, {
                _id: 0,
                __v: 0,
            }, )
            .sort({
                _id: -1,
            })
            .limit(12);
        dataPre.reverse();
        dataHours.reverse();
        let data = [];

        for (let i = 11; i >= 0; i--) {
            let obj = {};
            Object.assign(obj, {
                time: dataPre[i].time,
                temperature: dataPre[i].temperature,
            });
            Object.assign(obj, {
                temp: dataHours[i].temperature,
            });
            // console.log(dataPre[i]);

            data.push(obj);
        }
        console.log(dataPre);
        return data;
    } catch (error) {
        return [];
    }
};