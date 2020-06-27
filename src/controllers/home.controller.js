const {
    Parser
} = require('json2csv');
const Weather_temp = require('../models/weatherTemp.model')
const Weather = require('../models/weather.model')
Date.prototype.addHoures = function(h) {
    this.setHours(this.getHours() + h);
    return this;
};

module.exports.home = async(req, res, next) => {
    res.render('../views/home/index.pug');
};

// export data to csv limit 1000 (minutes)
module.exports.exportCsvData = async(req, res, next) => {
    const fields = ['time', 'temperature', 'humidity', 'pressure', 'rain'];
    const data = await Weather_temp.find({}, {
        time: 1,
        temperature: 1,
        humidity: 1,
        pressure: 1,
        rain: 1,
        _id: 0,
    }).sort({
        _id: -1
    }).limit(1000)
    data.reverse()
    const json2csv = new Parser({
        fields: fields
    })
    try {
        const csv = json2csv.parse(data)
        res.attachment('data.csv')
        res.status(200).send(csv)
    } catch (error) {
        console.log(error)
        next(error)
    }
};
module.exports.exportCsvDataHour = async(req, res, next) => {
    const fields = ['time', 'temperature', 'humidity', 'pressure', 'rain'];
    const data = await Weather.find({}, {
        time: 1,
        temperature: 1,
        humidity: 1,
        pressure: 1,
        rain: 1,
        _id: 0,
    }).sort({
        _id: -1
    }).limit(1000)
    data.reverse()
    const json2csv = new Parser({
        fields: fields
    })
    try {
        const csv = json2csv.parse(data)
        res.attachment('data.csv')
        res.status(200).send(csv)
    } catch (error) {
        console.log(error)
        next(error)
    }
};
module.exports.all = async(req, res, next) => {
    const items = await Weather.find({}, {
        _id: 0,
        __v: 0
    }).sort({
        time: 1
    })
    await Weather.remove();
    items.forEach(async e => {
        // console.log(typeof e.time);
        e.time = e.time.addHoures(7);
        let obj = JSON.stringify(e);
        await Weather.create(JSON.parse(obj));
        console.log(obj);
    });


    res.json(items)
}