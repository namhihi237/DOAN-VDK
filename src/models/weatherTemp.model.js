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
        expires: 30,
        default: Date.now
    } // expires in 30 seconds
});
// weatherSchema.createIndex({})
module.exports = mongoose.model('weather_temp', weatherSchema, 'weather_temp');