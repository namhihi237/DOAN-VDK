const Weather = require('../models/weather.model');
const Weather_temp = require('../models/weatherTemp.model');

const CronJob = require('cron').CronJob;

// crob dung de tinh gia tri trung binh cua cac du lieu sau do luu vao db de lam du lieu cho du doan
const job = new CronJob(
    `* * * * * *`,
    function() {
        console.log('You will see this message every second');
        const date = new Date();
        date.setHours(date.getHours() + 7); // format date  timezone VietNam
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();
        const hour = date.getHours();
        console.log(`${year}/${month}/${day}: ${hour}`);
        console.log(date);
    },
    null,
    true,
    'Asia/Ho_Chi_Minh',
);

module.exports = job;