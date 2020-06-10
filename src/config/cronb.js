require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});
const CronJob = require('cron').CronJob;
const axios = require('axios');
const Weather_temp = require('../models/weatherTemp.model');
const TempPredict = require('../models/tempPredict.model');
const getData = require('../controllers/tempPredict.chart.controller');
const app = require('../app');

Date.prototype.addHoures = function(h) {
    this.setHours(this.getHours() + h)
    return this
}

const job = new CronJob('0 * * * * *', async function() {
    console.log('get update predict');
    const input = await Weather_temp.find({}, {
            temperature: 1,
            humidity: 1,
            pressure: 1,
            _id: 0,
        }, )
        .sort({
            _id: -1,
        })
        .limit(24);
    input.reverse();

    if (input.length == 24) {
        try {
            const result = await axios({
                method: 'post',
                url: process.env.API,
                data: {
                    input,
                },
            });

            let date = new Date()

            date.addHoures(7)
            await TempPredict.create({
                time: date,
                temperature: result.data.result
            })
            const dataIo = await getData.getTempPredict();
            app.io.emit('Sv-send', dataIo);
        } catch (error) {

            console.log(error.Error);

        }
    } else {
        console.log("Data not enough");

    }
}, null, true, 'Asia/Ho_Chi_Minh');
module.exports = job;