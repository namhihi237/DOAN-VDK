const mongoose = require('mongoose');
const weatherSchema = new mongoose.Schema({
    time: {
        type: Date,
        default: Date.now(),
    },
    temperature: {
        type: Number,
    },
    humidity: {
        type: Number,
    },
    pressure: {
        type: Number,
    },
    rain: {
        type: Number,
    },
    createdAt: {
        type: Date,
        expires: 86400,
        default: Date.now
    } // expires in 1 day
});
module.exports = mongoose.model('weather_temp', weatherSchema, 'weather_temp');