const port = 80
google.charts.load("current", {
    callback: init,
    packages: ["corechart", "line"]
});
google.charts.setOnLoadCallback(drawChart);

function init() {
    let socket = io(`http://localhost:${port}`);
    socket.emit("Client-send-pressure", "sendData")
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
        dataChart.push([`${hours}:${munites}`, item.pressure])
    })
    dataChart.reverse()
    dataChart.unshift(["time", "pressure"])
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
            title: 'hPa'
        },
        // backgroundColor: '#e4ef9b'
    };
    let chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}