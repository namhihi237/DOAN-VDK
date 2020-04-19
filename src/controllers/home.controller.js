const {
    Parser
} = require('json2csv');
const Weather = require('../models/weatherTemp.model')

module.exports.home = async(req, res, next) => {
    res.render('../views/home/index.pug');
};

// export data to csv limit 1000
module.exports.exportCsvData = async(req, res, next) => {
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