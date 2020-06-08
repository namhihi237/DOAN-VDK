const mongoose = require("mongoose");
require("dotenv-safe").config({
    example: process.env.CI ? ".env.ci.example" : ".env.example"
});
// config connect mongodb
exports.connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
        });
    } catch (error) {
        console.log(error);
    }
    return mongoose.connection;
};