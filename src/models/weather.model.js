const mongoose = require('mongoose');
const weatherSchema = new mongoose.Schema({
    time: {
        type: Date,
        // default: Date.now(),
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
});
module.exports = mongoose.model('weather', weatherSchema, 'weather');