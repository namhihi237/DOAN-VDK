google.charts.load("current", {
    callback: init,
    packages: ["corechart", "line", ]
});
google.charts.setOnLoadCallback(drawChart);
document.getElementById("temp").value = "nampro"
Date.prototype.addHoures = function(h) {
    this.setHours(this.getHours() + h)
    return this
}

function init() {

    let socket = io();
    socket.emit("Client-send-tempPredict", "sendData")
    socket.on('Sv-send', (data) => {
        drawChart(data);
        let date = new Date(data[1][0].time)
        date.addHoures(-7)
        document.getElementById("temp").innerText = ` Hệ thống dự đoán nhiệt độ lúc ${date.getHours() + 1} giờ vào khoảng ${+data[1][0].temperature.toFixed(2)} (°C)`;
        if (data[2].resultRain == 0) {
            document.getElementById("rain").innerText = `Dự báo vào khoảng ${data[2].start} h - ${+data[2].end} h trời không có mưa`;
        } else {
            document.getElementById("rain").innerText = `Dự báo vào khoảng ${data[2].start} h - ${data[2].end } h trời có mưa`;
        }

    })
}

function drawChart(input) {
    dataChart = []
    input[0].forEach(item => {
        let time = new Date(item.time)
        time.setHours(time.getHours() - 7) // conver timezone VN
        let hours = time.getHours()
        let day = time.getDate();
        // let munites = time.getMinutes()
        dataChart.push([`${hours + 1}h/${day}`, item.temperature, item.temp])
    })
    dataChart.reverse()
        // dataChart = dataChart.unshift(["time", "temperature"])
        // console.log(dataChart);
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'X');
    data.addColumn('number', 'Dự đoán');
    data.addColumn('number', 'Thực tế');
    data.addRows(dataChart);
    var options = {
        // title: 'Weather ',
        curveType: 'function',
        legend: {
            position: 'bottom'
        },
        hAxis: {

            title: 'Time'
        },
        colors: ['#a52714', '#097138'],
        vAxis: {
            title: '°C'
        },
        crosshair: {
            color: '#000',
            trigger: 'selection'
        },
        chartArea: {
            left: 150,
            top: 20,
            width: "80%",
            height: "70%"
        }
        // backgroundColor: '#e4ef9b',
    };
    let chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
    chart.setSelection([{
        row: 38,
        column: 1
    }]);
}