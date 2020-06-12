require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});
const WeatherPredict = require('../models/tempPredict.model');
const Weather_temp = require('../models/weatherTemp.model');
const Weather = require('../models/weather.model');
const axios = require('axios')
module.exports.chartTempPredict = async(req, res, next) => {

    res.render('chart/tempPredict.chart.pug');
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
            .limit(1);

        const dataHours = await Weather.find({}, {
                _id: 0,
                __v: 0,
            }, )
            .sort({
                _id: -1,
            })
            .limit(24);
        // dataHours.reverse();
        // console.log(dataHours);
        let data = [];


        data.push(dataHours)
        data.push(dataPre)


        // data.push(obj);
        // }

        //
        let resultRain = ""
        let dateH = new Date();
        let start, end;
        let limit = 0;
        if (dateH.getHours() < 12) {
            limit = dateH.getHours() + 12;
            start = 0;
            end = 12;
        } else {
            limit = dateH.getHours();
            start = 12;
            end = 24;
        }
        let inputA = await Weather.find({}, {
                temperature: 1,
                humidity: 1,
                pressure: 1,
                rain: 1,
                _id: 0,
            }, )
            .sort({
                _id: -1,
            })
            .limit(limit);
        inputA = inputA.slice(0, 12);
        inputA.reverse();

        try {
            resultRain = await axios({
                method: 'post',
                url: process.env.API_rain,
                data: {
                    inputA,
                },
            });
            resultRain = resultRain.data.result;

        } catch (error) {
            console.log(error);

        }
        //
        data.push({
            resultRain,
            start,
            end
        })

        // console.log(data);

        return data;
    } catch (error) {
        return [];
    }
};