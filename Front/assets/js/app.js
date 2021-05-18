var ctx = $('#chart')[0].getContext('2d')
var ctx2 = $('#chart2')[0].getContext('2d')
var chart, chart2

$(document).ready(() => {
    $.ajax({
        url:"http://192.168.0.185:3000",
        type:"GET",
        success:(data) => {
            var today = data.data[data.data.length - 1]
            var estimation_date = new Date(data.data[0].date)
            $('#percent_vaccin').text(`${round((today.vaccins * 100) / 67000000)}% vaccinés`)
            $('#remaining_vaccin').text(`Encore ${numberWithSpaces((67000000 * 0.67)-today.vaccins)} personnes à vaccinés avant d'atteindre l'immunité collective (selon l'institut Pasteur). Selon notre estimation, cela sera le ${convertDate(estimation_date.addDays((today.id * 67000000*0.67)/today.vaccins))}`)
            $('#first_dose').text(numberWithSpaces(today.first_dose))
            $('#first_dose_today').text(`+${numberWithSpaces(today.new_first_dose)} aujourd'hui`)
            $('#vaccins').text(numberWithSpaces(today.vaccins))
            $('#new_vaccins').text(`+${numberWithSpaces(today.new_vaccins)} aujourd'hui`)
            var vaccins = []
            var new_vaccins = []
            var labels = []
            data.data.forEach(el => {
                labels.push(convertDate(el.date))
                new_vaccins.push(el.new_vaccins)
                vaccins.push(el.vaccins)
            })
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Vaccins',
                            data: vaccins,
                            fill: true,
                            yAxisID: 'y',
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.4
                        },
                        {
                            label: 'New Vaccins',
                            data: new_vaccins,
                            fill: true,
                            yAxisID: 'y1',
                            borderColor: 'red',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    stacked: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            position: 'left',
                            display: true
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }                    
                }
            })
            var estimations_labels = []
            var estimations_data = []
            for(i = 0; i < 200; i += 20) {
                var startDate = new Date(today.date)
                var dt = startDate.addDays(i)
                estimations_labels.push(convertDate(dt))
                estimations_data.push((today.vaccins / today.id) * i + today.vaccins)
            }
            chart2 = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: estimations_labels,
                    datasets: [
                        {
                            label: 'Estimations',
                            data: estimations_data,
                            fill: true,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    stacked: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    }                  
                }
            })
        },
        error:(err) => {
            console.log(err)
        }
    }); 
})

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function round(num) {
    return Math.round(num * 100) / 100
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}