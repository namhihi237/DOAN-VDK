const mongoose = require('mongoose');
// implement add munite Date
Date.prototype.addHoures = function(h) {
    this.setHours(this.getHours() + h);
    return this;
};
const weatherSchema = new mongoose.Schema({
    time: {
        type: Date,
        // default: Date.now(),
    },
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    pressure: {
        type: Number,
        required: true,
    },
    rain: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date().addHoures(168),
    }, // expires in 1 day
});

module.exports = mongoose.model('weather_temp', weatherSchema, 'weather_temp');