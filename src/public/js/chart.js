google.charts.load("current", {
    callback: init,
    packages: ["corechart", "line"]
});
google.charts.setOnLoadCallback(drawChart);

function init() {
    let socket = io('http://localhost:80');
    socket.emit("Client-send-data", "sendData")
    socket.on('Sv-send', (data) => {
        drawChart(data)
    })
}



function drawChart(input) {
    dataChart = [
        ["stt", "temperature"]
    ]
    let i = 0;
    input.forEach(item => {
        dataChart.push([i, item.temperature])
        i += 1
    })
    let data = google.visualization.arrayToDataTable(dataChart);
    var options = {
        title: 'Weather ',
        curveType: 'function',
        legend: {
            position: 'bottom'
        }
    };
    let chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}