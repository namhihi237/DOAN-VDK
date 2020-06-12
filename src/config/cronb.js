require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});
const CronJob = require('cron').CronJob;
const axios = require('axios');
const Weather_temp = require('../models/weatherTemp.model');
const Weather = require('../models/weather.model');
const TempPredict = require('../models/tempPredict.model');
const getData = require('../controllers/tempPredict.chart.controller');
const app = require('../app');

Date.prototype.addHoures = function(h) {
    this.setHours(this.getHours() + h)
    return this
}

const job = new CronJob('* 0 * * * *', async function() {
    console.log('get update predict');
    const input = await Weather.find({}, {
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
    // console.log(input.length);

    if (input.length == 24) {
        // console.log("ok");

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
                // console.log(result.data.result);

            const dataIo = await getData.getTempPredict();
            // du doan mua
            let resultRain = ""
            let dateH = new Date();
            let start, end;
            let limit = 0;
            if (dateH.getHours() < 12) {
                limit = dateH.getHours() + 12;
                start = 0;
                end = 12;
            } else {
                limit = dateH.getHours();
                start = 12;
                end = 24;
            }


            let inputA = await Weather.find({}, {
                    temperature: 1,
                    humidity: 1,
                    pressure: 1,
                    rain: 1,
                    _id: 0,
                }, )
                .sort({
                    _id: -1,
                })
                .limit(limit);
            inputA = inputA.slice(0, 12);
            inputA.reverse();

            try {
                resultRain = await axios({
                    method: 'post',
                    url: process.env.API_rain,
                    data: {
                        inputA,
                    },
                });
                resultRain = resultRain.data.result;

            } catch (error) {
                console.log(error);

            }

            dataIo.push({
                resultRain,
                start,
                end
            });

            app.io.emit('Sv-send', dataIo);
        } catch (error) {

            console.log(error.Error);

        }
    } else {
        console.log("Data not enough");


    }
}, null, true, 'Asia/Ho_Chi_Minh');
module.exports = job;