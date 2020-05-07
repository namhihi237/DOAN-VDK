const mongoose = require('mongoose');
const tempPredict = new mongoose.Schema({
    time: {
        type: Date,
        // default: Date.now(),
    },
    temperature: {
        type: Number,
        required: true
    },
});
module.exports = mongoose.model('temp_predict', tempPredict, 'temp_predict');