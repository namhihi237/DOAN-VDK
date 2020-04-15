const Weather = require('../models/weather.model');
const Weather_temp = require('../models/weatherTemp.model')
const axios = require('axios');

module.exports.getAll = async(req, res, next) => {
    const items = await await Weather.find({}, {
            temperature: 1,
            humidity: 1,
            pressure: 1,
            rain: 1,
            _id: 0
        })
        .sort({
            _id: -1
        })
        .limit(24);
    res.json(items);
};

module.exports.insertData = async(req, res, next) => {
    const data = req.query;
    try {
        const item = await Weather_temp.create(data);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

module.exports.getDataFromEspCalculator = async(req, res, next) => {
    const data = req.query
    const temperature = data.temperature
    const humidity = data.humidity
    const pressure = data.pressure
    const rain = data.rain



}

module.exports.tempPredictAnHour = async(req, res, next) => {
    const input = await Weather.find({}, {
            temperature: 1,
            humidity: 1,
            pressure: 1,
            rain: 1,
            _id: 0
        })
        .sort({
            _id: -1
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