const Weather = require('../models/weather.model');
const Weather_temp = require('../models/weatherTemp.model');
const axios = require('axios');
const ronb = require('cron');

module.exports.getAll = async(req, res, next) => {
    const items = await await Weather.find({}, {
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
    res.json(items);
};

module.exports.insertData = async(req, res, next) => {
    const data = req.query;
    const date = new Date()
    date.setHours(date.getHours() + 7)
    const time = {
        time: date
    }
    const record = Object.assign(time, data);
    try {
        const item = await Weather_temp.create(record);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

// tinh toan du lieu trung binh 1 gio luu vao database weather
module.exports.calculatorDataAndSaveAnHour = async(req, res, next) => {};

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
    try {
        const result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1',
            data: {
                input,
            },
        });
        res.json(result.data);
    } catch (error) {
        next(error);
    }
};