google.charts.load("current", {
    callback: init,
    packages: ["corechart", "line", ]
});
google.charts.setOnLoadCallback(drawChart);

function init() {

    let socket = io();
    socket.emit("Client-send-temp", "sendData")
    socket.on('Sv-send', (data) => {
        drawChart(data)
    })
}

function drawChart(input) {
    dataChart = []
    input.forEach(item => {
        let time = new Date(item.time)
        time.setHours(time.getHours() - 7) // conver timezone VN
        let hours = time.getHours()
        let munites = time.getMinutes()
        dataChart.push([`${hours}:${munites}`, item.temperature])
    })
    dataChart.reverse()
    dataChart.unshift(["time", "temperature"])
    let data = google.visualization.arrayToDataTable(dataChart);

    var options = {
        // title: 'Weather ',
        curveType: 'function',
        legend: {
            position: 'bottom'
        },
        hAxis: {

            title: 'Time'
        },
        vAxis: {
            title: '°C'
        },
        chartArea: {
            left: 150,
            top: 20,
            width: "90%",
            height: "70%"
        }
        // backgroundColor: '#e4ef9b',
    };
    let chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}