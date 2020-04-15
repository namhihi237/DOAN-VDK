const Weather = require('../models/weather.model');
const Weather_temp = require('../models/weatherTemp.model');

const CronJob = require('cron').CronJob;

const job = new CronJob(`* * * * * *`, function() {
        console.log('You will see this message every second');
        const date = new Date()
        date.setHours(date.getHours() + 7) // format date  timezone VietNam
    }, null,
    true,
    "Asia/Ho_Chi_Minh");

module.exports = job