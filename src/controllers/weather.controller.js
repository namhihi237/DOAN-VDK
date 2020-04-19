require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});
const Weather = require('../models/weather.model');
const Weather_temp = require('../models/weatherTemp.model');
const axios = require('axios');

Date.prototype.addHoures = function(h) {
        this.setHours(this.getHours() + h)
        return this
    }
    // module.exports.getAll = async(req, res, next) => {
    //     const items = await await Weather.find({}, {
    //             temperature: 1,
    //             humidity: 1,
    //             pressure: 1,
    //             rain: 1,
    //             _id: 0,
    //         }, )
    //         .sort({
    //             _id: -1,
    //         })
    //         .limit(24);
    //     res.json(items);
    // };

module.exports.insertData = async(req, res, next) => {
    const data = req.query;
    let date = new Date()

    let hour = date.getHours()
    date.addHoures(7)
    const time = {
        time: date
    }

    const record = Object.assign(time, data);
    //check time xem da sang gio tiep theo chua
    const preData = await Weather_temp.find().sort({
            _id: -1
        }).limit(1) // get record last add

    if (preData.length == 1) {
        preData[0].time.setHours(preData[0].time.getHours() - 7)
        const preHour = preData[0].time.getHours();
        if (hour != preHour) {
            const preYear = preData[0].time.getFullYear()
            const preMonth = preData[0].time.getMonth()
            const preDay = preData[0].time.getDate()

            const startDate = new Date(preYear, preMonth, preDay, preHour, 0, 0)
            startDate.setHours(startDate.getHours() + 7)
            const endDate = new Date(preYear, preMonth, preDay, preHour, 59, 59)
            endDate.setHours(endDate.getHours() + 7)
                // console.log(startDate, endDate)
            const query = {
                $and: [{
                        time: {
                            $gte: startDate
                        }
                    },
                    {
                        time: {
                            $lte: endDate
                        }
                    }
                ]
            }
            try {
                const dataPreHour = await Weather_temp.find(query)
                let temperature = 0;
                let humidity = 0;
                let pressure = 0;
                let rain = 0
                const lengthRecord = dataPreHour.length
                dataPreHour.forEach((item) => {
                    temperature = temperature + parseFloat(item.temperature)
                    humidity = humidity + parseFloat(item.humidity)
                    pressure = pressure + parseFloat(item.pressure)
                    rain = rain + parseFloat(item.rain)
                })
                temperature = parseFloat((temperature / lengthRecord).toFixed(2))
                humidity = parseFloat((humidity / lengthRecord).toFixed(2))
                pressure = parseFloat((pressure / lengthRecord).toFixed(2))
                if (rain != 0) {
                    rain = 1
                }
                const avgData = {
                    time: startDate,
                    temperature,
                    humidity,
                    pressure,
                    rain
                }
                await Weather.create(avgData)
            } catch (error) {
                next(error)
            }
        }
    }
    try {
        const item = await Weather_temp.create(record);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};


module.exports.tempPredictAnHour = async(req, res, next) => {
    const input = await Weather.find({}, {
            temperature: 1,
            humidity: 1,
            pressure: 1,
            rain: 1,
            _id: 0,
        }, )
        .sort({
            _id: -1,
        })
        .limit(24);
    // input.reverse();
    if (input.length == 24) {
        try {
            const result = await axios({
                method: 'post',
                url: process.env.TEMPERATURE_API,
                data: {
                    input,
                },
            });
            res.render('predict/predict.pug', {
                result
            })
        } catch (error) {
            res.render('predict/predict.pug', {
                mess: 'Server API flask not working '
            })
            next(error);
        }
    } else {
        res.render('predict/predict.pug', {
            mess: 'Data is not enough '
        })
    }
};