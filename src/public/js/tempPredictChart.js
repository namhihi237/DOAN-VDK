google.charts.load("current", {
    callback: init,
    packages: ["corechart", "line", ]
});
google.charts.setOnLoadCallback(drawChart);

function init() {

    let socket = io();
    socket.emit("Client-send-tempPredict", "sendData")
    socket.on('Sv-send', (data) => {
        drawChart(data)
    })
}

function drawChart(input) {
    dataChart = []
    let i = 0;
    input.forEach(item => {
        let time = new Date(item.time)
        time.setHours(time.getHours() - 7) // conver timezone VN
        let hours = time.getHours()
        let day = time.getDate();
        // let munites = time.getMinutes()
        i += 1;
        dataChart.push([`${hours + 1}h/${day}`, item.temperature, item.temp])
    })
    dataChart.reverse()
        // dataChart = dataChart.unshift(["time", "temperature"])
    console.log(dataChart);
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