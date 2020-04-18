const mongoose = require('mongoose');
// implement add munite Date
Date.prototype.addHoures = function(h) {
    this.setHours(this.getHours() + h)
    return this
}
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
    createdAt: {
        type: Date,
        default: new Date().addHoures(168)
    } // expires in 1 day
});

module.exports = mongoose.model('weather_temp', weatherSchema, 'weather_temp');