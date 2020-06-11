require('dotenv-safe').config({
    example: process.env.CI ? '.env.ci.example' : '.env.example',
});
const request = require('request');
const weather_temp = require('../models/weatherTemp.model')
const tempPredcit = require('../models/tempPredict.model')
const axios = require('axios')
    // Sets server port and logs message on success
module.exports.postWebhook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            // console.log(webhook_event);
            let sender_psid = webhook_event.sender.id;
            console.log(sender_psid);
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {

                handleMessage(sender_psid, webhook_event.message);

            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

module.exports.getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = 'poppycute';

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

async function handlePostback(sender_psid, received_postback) {
    let response;
    let text, buttons;
    text = "Chọn chức năng !!";
    buttons = [{
                "type": "postback",
                "title": "Thời tiết hiện tại",
                "payload": "weather",
            },
            {
                "type": "postback",
                "title": "Dự đoán nhiệt độ",
                "payload": "tempPredict",
            }, {
                "type": "postback",
                "title": "Dự đoán mưa",
                "payload": "rain",
            },
        ]
        // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'weather') {
        const weather = await weather_temp.find({}, {
                temperature: 1,
                humidity: 1,
                pressure: 1,
                rain: 1,
                _id: 0,
            }, )
            .sort({
                _id: -1,
            })
            .limit(1);
        let rainText = '';
        if (weather[0].rain == 1) {
            rainText = 'Trời đang có mưa '
        } else rainText = 'Trời không mưa'
        response = {
            "text": `Nhiệt độ 🌡️ : ${weather[0].temperature} °C
Áp suất : ${weather[0].pressure} hPa
Độ ẩm : ${weather[0].humidity} %
${rainText}
            `
        }

    } else if (payload === 'tempPredict') {


        const input = await weather_temp.find({}, {
                temperature: 1,
                humidity: 1,
                pressure: 1,
                _id: 0,
            }, )
            .sort({
                _id: -1,
            })
            .limit(24);
        if (input.length == 24) {
            const result = await axios({
                method: 'post',
                url: process.env.API,
                data: {
                    input,
                },
            });
            console.log(result.data.result);

            response = {
                "text": `Nhiệt độ sau 1 giờ là : ${result.data.result} °C`
            }
        }

    } else if (payload == 'rain') {
        // const input = await weather_temp.find({}, {
        //         temperature: 1,
        //         humidity: 1,
        //         pressure: 1,
        //         rain: 1,
        //         _id: 0,
        //     }, )
        //     .sort({
        //         _id: -1,
        //     })
        //     .limit(12);
        // console.log(input);

        // if (input.length == 12) {
        //     try {
        //         const result = await axios({
        //             method: 'post',
        //             url: process.env.API_rain,
        //             data: {
        //                 input,
        //             },
        //         });
        //         console.log(result.data.result);
        //         if (result.data.result == 0) {
        //             response = {
        //                 "text": `Hệ thống dự đoán không có ⛈️ vào khoảng thời gian ${12}`
        //             }
        //         } else {
        //             response = {
        //                 "text": `Hệ thống dự đoán sẽ có mưa vào khoảng thời gian ${12}`
        //             }
        //         }
        //     } catch (error) {
        //         response = {
        //             "text": `Server not working `
        //         }
        //     }
        // } else {
        //     response = {
        //         "text": `Data not enough `
        //     }
        // }
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
        let inputA = await Weather_temp.find({}, {
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
        console.log(inputA);

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
        if (resultRain == 0) {
            response = {
                "text": `Hệ thống dự đoán không có ⛈️ vào khoảng thời gian ${start}h - ${end} h `
            }
        } else {
            response = {
                "text": `Hệ thống dự đoán  có ⛈️ vào khoảng thời gian ${start} h  - ${end} h`
            }
        }
    }
    // Send the message to acknowledge the postback
    await callSendAPI(sender_psid, response);
    await sendButtonMessage(sender_psid, text, buttons)
}

function handleMessage(sender_psid, received_message) {
    let response;
    let text, buttons;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        // response = {
        //     "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        // }
        text = `Chọn chức năng !!`;
        buttons = [{
                "type": "postback",
                "title": "Thời tiết hiện tại",
                "payload": "weather",
            },
            {
                "type": "postback",
                "title": "Dự đoán nhiệt độ",
                "payload": "tempPredict",
            },
            {
                "type": "postback",
                "title": "Dự đoán mưa",
                "payload": "rain",
            },

        ]

    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        // console.log(attachment_url);
    }

    // Send the response message
    // callSendAPI(sender_psid, response);
    sendButtonMessage(sender_psid, text, buttons)
}

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN
            },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        },
    );
}

function sendButtonMessage(senderId, text, buttons) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": buttons
            }
        }
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}