var mini_first_dose = $('#mini-first-dose')[0].getContext('2d')
var mini_first_dose_prediction = $('#mini-first-dose-estimation')[0].getContext('2d')
var mini_vaccins = $('#mini-vaccins')[0].getContext('2d')
var mini_vaccins_prediction = $('#mini-vaccins-estimation')[0].getContext('2d')
var mini_new_first_dose = $('#mini-new-first-dose')[0].getContext('2d')
var mini_new_vaccins = $('#mini-new-vaccins')[0].getContext('2d')
var deliveries = $('#deliveries-chart')[0].getContext('2d')
var injected_doses = $('#injected-doses')[0].getContext('2d')
var percent_bar = $('#percent_bar')[0].getContext('2d')

var fullChart = null

const pop = 66732538
const immunity = 0.67
var vaccins = []
var first_dose = []
var new_vaccins = []
var new_first_dose = []
var labels = []
var dataAll = []
var deliveriesData = {}
var injectedData = {}
var deliveriesLabels = []
var labelsDates = []

const monthsMin = [
    'janv.',
    'févr.',
    'mars',
    'avr.',
    'mai',
    'juin',
    'juill.',
    'août',
    'sept.',
    'oct.',
    'nov.',
    'déc.'
]
const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
]

$(".card-tooltip").click(function(e) {
    e.stopPropagation();
 });

$(document).ready(() => {
    $.ajax({
        url:"https://api.fucklemasque.fr/",
        type:"GET",
        success:(data) => {
            data.data.events.forEach((el) => {
                var diff = datediff(new Date(), new Date(el.date))
                var htmlEvent = `<div class="event-card">
                <span class="event-date">${convertDate(el.date)}</span>
                ${diff > 0 ? '<span class="event-countdown">Dans ' + diff + ' jours</span>' : ''}
                <p>${el.description}</p>
                </div>`
                $('#all-events').append(htmlEvent)
                if(diff > 0) {
                    $('#next-events').append(htmlEvent)
                }
            })

            dataAll = data.data.vaccins
            var today = dataAll[dataAll.length - 1]
            var yesterday = dataAll[dataAll.length - 2]
            $('#percent_vaccin').text(`${round((today.vaccins * 100) / pop)}% vaccinés`)            
            $('#first_dose').text(numberWithSpaces(today.first_dose))
            $('#first_dose_today').text(`+${numberWithSpaces(today.new_first_dose)}`)
            $('#vaccins').text(numberWithSpaces(today.vaccins))
            $('#vaccins-pred').html(numberWithSpaces(today.vaccins) + '<span>(actuellement)</span>')
            $('#first-dose-pred').html(numberWithSpaces(today.first_dose) + '<span>(actuellement)</span>')
            $('#new_vaccins').text(`+${numberWithSpaces(today.new_vaccins)}`)

            const new_vaccin_variation = Math.trunc(((today.new_vaccins - yesterday.new_vaccins) / yesterday.new_vaccins) * 100)
            const new_first_dose_variation = Math.trunc(((today.new_first_dose - yesterday.new_first_dose) / yesterday.new_first_dose) * 100)
            $('#new_vaccins_variation').html(`${new_vaccin_variation > 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>'} ${numberWithSpaces(new_vaccin_variation)}%`)
            $('#new_vaccins_variation').addClass(new_vaccin_variation > 0 ? 'var-p' : 'var-n')
            $('#new_first_dose_variation').html(`${new_first_dose_variation > 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>'} ${numberWithSpaces(new_first_dose_variation)}%`)
            $('#new_first_dose_variation').addClass(new_first_dose_variation > 0 ? 'var-p' : 'var-n')

            const vaccin_variation = Math.trunc(((today.vaccins - yesterday.vaccins) / yesterday.vaccins) * 100)
            const first_dose_variation = Math.trunc(((today.first_dose - yesterday.first_dose) / yesterday.first_dose) * 100)
            $('#vaccins_variation').html(`${vaccin_variation > 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>'} ${numberWithSpaces(vaccin_variation)}%`)
            $('#vaccins_variation').addClass(vaccin_variation > 0 ? 'var-p' : 'var-n')
            $('#first_dose_variation').html(`${first_dose_variation > 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>'} ${numberWithSpaces(first_dose_variation)}%`)
            $('#first_dose_variation').addClass(first_dose_variation > 0 ? 'var-p' : 'var-n')
            
            dataAll.forEach(el => {
                var date = new Date(el.date)
                labels.push(`${date.getDate()} ${monthsMin[date.getMonth()]}`)
                labelsDates.push(el.date)
                first_dose.push(el.first_dose)
                new_vaccins.push(el.new_vaccins)
                new_first_dose.push(el.new_first_dose)
                vaccins.push(el.vaccins)
            })

            miniChart(mini_vaccins, vaccins, labels, vaccin_variation)
            miniChart(mini_first_dose, first_dose, labels, first_dose_variation)
            miniChart(mini_new_vaccins, new_vaccins, labels, new_vaccin_variation)
            miniChart(mini_new_first_dose, new_first_dose, labels, new_first_dose_variation)
            miniPredictChart(mini_vaccins_prediction, vaccins, labelsDates)
            miniPredictChart(mini_first_dose_prediction, first_dose, labelsDates)
            $('#remaining_vaccin').text(`Encore ${numberWithSpaces(Math.trunc((pop * immunity)-today.vaccins))} personnes à vaccinés avant d'atteindre l'immunité collective (selon l'institut Pasteur). Selon notre estimation, cela sera le ${convertDate(getImmunityDate().toString(), false)}`)
            
            new Chart(percent_bar, {
                plugins: [ChartDataLabels],
                type: 'bar',
                data: {
                    labels: [
                        'Vaccinés'
                    ],
                    datasets: [
                        {
                            label: 'Vaccinés',
                            data: [round((today.vaccins * 100) / pop)],
                            backgroundColor: '#c4f0aa'
                        },
                        {
                            label: 'Non vaccinés',
                            data: [100 - round((today.vaccins * 100) / pop)],
                            backgroundColor: '#f7a79c'
                        }
                    ],
                    datalabels: {
                        color: '#fff',
                        font: {
                            family: "'Roboto', 'sans-serif'",
                            weight: '500',
                            size: 20
                        }
                    }
                },
                options: {
                    plugins: {
                        tooltip: {
                            enabled: false
                        },
                        legend: {
                            display: false
                        },
                        datalabels: {
                            color: '#fff',
                            formatter: function(value, context) {
                                return value + ' %';
                            }
                        }
                        /*annotation: {
                            annotations: [
                                {
                                    type: 'line',
                                    label: {
                                        content: round((today.vaccins * 100) / pop) + "%",
                                        enabled: true,
                                        position: "top",
                                        font: {
                                            size: 10
                                        }
                                    },
                                    xMin: round((today.vaccins * 100) / pop),
                                    xMax: round((today.vaccins * 100) / pop),
                                    borderColor: 'rgb(0, 0, 0, 0.5)',
                                    borderWidth: 2
                                }
                            ]
                        }*/
                    },
                    indexAxis: 'y',
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                            ticks: {
                                display: false
                            },
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        },
                        y: {
                            stacked: true,
                            ticks: {
                                display: false
                            },
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        }
                    },
                    maintainAspectRatio: false
                }
            })

            fetch('https://raw.githubusercontent.com/rozierguillaume/vaccintracker/main/data/output/flux-total-nat.json', {cache: 'no-cache'})
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                deliveriesData = json
                var deliveriesStock = getTotalStock()
                $('#deliveries').text(numberWithSpaces(deliveriesStock.value))
                $('#deliveries_variation').html(`${deliveriesStock.variation > 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>'} ${numberWithSpaces(deliveriesStock.variation)}%`)
                $('#deliveries_variation').addClass(deliveriesStock.variation > 0 ? 'var-p' : 'var-n')
                new Chart(deliveries, {
                    type: 'line',
                    data: {
                        labels: json.jour,
                        datasets: [
                            {
                                label: 'Pfizer',
                                data: json["1"].jour.map((day, idx) => ({x: day, y: json["1"].nb_doses_cum[idx]})),
                                fill: true,
                                borderColor: "#60c0a8",
                                backgroundColor: "#60c0a8",
                                tension: 0.1
                            },
                            {
                                label: 'Moderna',
                                data: json["2"].jour.map((day, idx) => ({x: day, y: json["2"].nb_doses_cum[idx]})),
                                fill: true,
                                borderColor: "#f0f0a8",
                                backgroundColor: "#f0f0a8",
                                tension: 0.1
                            },
                            {
                                label: 'AstraZeneca',
                                data: json["3"].jour.map((day, idx) => ({x: day, y: json["3"].nb_doses_cum[idx]})),
                                fill: true,
                                borderColor: "#ffa860",
                                backgroundColor: "#ffa860",
                                tension: 0.1
                            },
                            {
                                label: 'Janssen',
                                data: json["4"].jour.map((day, idx) => ({x: day, y: json["4"].nb_doses_cum[idx]})),
                                fill: true,
                                borderColor: "#3090c0",
                                backgroundColor: "#3090c0",
                                tension: 0.1
                            }
                        ]
                    },
                    options:{
                        responsive: true,
                        plugins: {
                            tooltip: {
                                enabled: false
                            },
                            legend: {
                                display: false
                            },
                            annotation: {
                                annotations: [
                                    {
                                        type: 'line',
                                        label: {
                                            content: "Aujourd'hui",
                                            enabled: true,
                                            position: "top",
                                            font: {
                                                size: 10
                                            }
                                        },
                                        xMin: deliveriesStock.id,
                                        xMax: deliveriesStock.id,
                                        borderColor: 'rgb(0, 0, 0, 0.5)',
                                        borderWidth: 2
                                    }
                                ]
                            }
                        },
                        elements: { point: { radius: 0 } },
                        scales: {
                            x: {
                                ticks: {
                                    display: false
                                },
                                grid: {
                                    display: false,
                                    drawBorder: false
                                }
                            },
                            y: {
                                stacked: true,
                                ticks: {
                                    display: false
                                },
                                grid: {
                                    display: false,
                                    drawBorder: false
                                }
                            }
                        }
                    }
                })
                deliveriesData.jour.forEach((el) => {
                    var date = new Date(el)
                    deliveriesLabels.push(`${date.getDate()} ${monthsMin[date.getMonth()]}`)
                })
            })
            .then(() => {
                fetch('https://raw.githubusercontent.com/rozierguillaume/vaccintracker/main/data/output/vacsi-v-fra.json', {cache: 'no-cache'})
                .then(response => {
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.json();
                })
                .then(json => {                    
                    injectedData = json
                    var N1 = injectedData["1"]["jour"].length-1
                    var N2 = injectedData["2"]["jour"].length-1
                    var N3 = injectedData["3"]["jour"].length-1
                    var N4 = injectedData["4"]["jour"].length-1
                    new Chart(injected_doses, {
                        type: 'pie',
                        data: {
                            labels: injectedData.noms_vaccins,
                            datasets: [
                                {
                                    data: [
                                        injectedData["1"].n_cum_dose1[N1]+injectedData["1"].n_cum_dose2[N1],
                                        injectedData["2"].n_cum_dose1[N2]+injectedData["2"].n_cum_dose2[N2],
                                        injectedData["3"].n_cum_dose1[N3]+injectedData["3"].n_cum_dose2[N3],
                                        injectedData["4"].n_cum_dose1[N4]+injectedData["4"].n_cum_dose2[N4]
                                    ],
                                    backgroundColor: [
                                        'rgb(96, 192, 168)',
                                        'rgb(255, 168, 96)',
                                        'rgb(48, 144, 192)',
                                        'rgb(240, 240, 168)'
                                    ],
                                    borderWidth: 0
                                }                                
                            ]
                        },
                        options: {
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    align: 'center'
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    })
                })
                .catch(() => {
                        console.log("error-types")
                    }
                )
            })
            .catch(() => {
                    console.log("error-types-livraisons")
                }
            )
            var estimations_labels = []
            var estimations_data = []
            for(i = 0; i < 200; i += 20) {
                var startDate = new Date(today.date)
                var dt = startDate.addDays(i)
                estimations_labels.push(convertDate(dt))
                estimations_data.push((today.vaccins / today.id) * i + today.vaccins)
            }
        },
        error:(err) => {
            console.log(err)
        }
    }); 
})

function showData() {
    $('#estimations-btn').addClass('active')
    $('#data-btn').removeClass('active')
    $('#estimations').show()
    $('#charts').hide()
}

function showEstimations() {
    $('#estimations-btn').removeClass('active')
    $('#data-btn').addClass('active')
    $('#estimations').hide()
    $('#charts').show()
}

function showNextEvents() {
    $('#next-events-btn').addClass('active')
    $('#all-events-btn').removeClass('active')
    $('#next-events').show()
    $('#all-events').hide()
}

function showAllEvents() {
    $('#next-events-btn').removeClass('active')
    $('#all-events-btn').addClass('active')
    $('#next-events').hide()
    $('#all-events').show()
}

function convertDate(inputFormat, min = true) {
    var d = new Date(inputFormat)
    if(min) {
        return `${d.getDate()} ${monthsMin[d.getMonth()]} ${d.getFullYear()}`
    } else {
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function round(num) {
    return Math.round(num * 100) / 100
}

function getTotalStock() {
    var idx_max = 0
    let today = new Date()
    deliveriesData.jour.map((value, idx) => {
        if (new Date(value).addDays(-4) <= today) {
            idx_max = idx
        }
    })
    return {
        "day": getFormattedDate(new Date(deliveriesData.jour[idx_max]).addDays(-4)),
        "value": deliveriesData.nb_doses_cum[idx_max],
        "variation": Math.trunc(((deliveriesData.nb_doses_cum[idx_max] - deliveriesData.nb_doses_cum[idx_max-1]) / deliveriesData.nb_doses_cum[idx_max-1]) * 100),
        "id": idx_max
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getFormattedDate(date) {
    var year = date.getFullYear()  
    var month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : '0' + month  
    var day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day    
    return month + '/' + day + '/' + year
}

function showCard(cardName) {
    $('#home').hide()
    $('#card-full').show()
    $('#close-btn').show()
    if(fullChart) {
        fullChart.destroy()
    }
    var chrt = $('#full-chart')[0].getContext('2d')
    var gradient = chrt.createLinearGradient(0, 0, 0, $(chrt.canvas).innerHeight());
    gradient.addColorStop(0, `rgba(190, 250, 209, 0.5)`);   
    gradient.addColorStop(1, `rgba(190, 250, 209, 0)`);
    var annotations = []
    var currLabels = labels
    var datasets = [
        {
            label: '',
            pointHitRadius: 20,
            data: null,
            fill: true,
            borderColor: 'rgb(52, 226, 101)',
            backgroundColor: gradient,
            tension: 0.2
        }
    ]
    var dates = labelsDates.slice(-5)
    var predictDates = [new Date(dates[dates.length - 1]).addDays(5)]
    for(i = 0; i < 24; i++) {
        predictDates.push(new Date(predictDates[predictDates.length - 1]).addDays(5))
    }
    dates.forEach((el, i) => {
        var date = new Date(el)
        dates[i] = `${date.getDate()} ${monthsMin[date.getMonth()]}`
    })
    predictDates.forEach((el, i) => {
        var date = new Date(el)
        predictDates[i] = `${date.getDate()} ${monthsMin[date.getMonth()]}`
    })
    switch(cardName) {
        case 'vaccinated':
            $('#card-full-title').text('Vaccinés')
            $('#card-full-descr').text(`Nombre cumulé de personnes ayant reçu toutes les doses de vaccin requises depuis le ${convertDate(dataAll[0].date, false)}.`)
            datasets[0].data = vaccins
            datasets[0].label = 'Vaccinés'
            break
        case 'first-dose':
            datasets[0].data = first_dose
            $('#card-full-title').text('Première dose')
            $('#card-full-descr').text(`Nombre cumulé de personnes ayant reçu au moins une dose depuis le ${convertDate(dataAll[0].date, false)}.`)
            datasets[0].label = 'Première dose'
            break
        case 'new-vaccinated':
            $('#card-full-title').text('Nouveaux Vaccinés')
            $('#card-full-descr').text(`Nombre de personnes ayant reçu toutes les doses de vaccin requises en 24h.`)
            datasets = [                
                {
                    label: 'Moyenne',
                    pointHitRadius: 20,
                    data: getRegression(new_vaccins),
                    fill: false,
                    borderColor: 'rgba(83, 204, 255, 0.5)',
                    tension: 0.2
                },
                {
                    label: 'Nouveaux vaccinés',
                    pointHitRadius: 20,
                    data: new_vaccins,
                    fill: true,
                    borderColor: 'rgb(52, 226, 101)',
                    backgroundColor: gradient,
                    tension: 0.1
                }
            ]
            break
        case 'new-first-dose':
            $('#card-full-title').text('Nouvelles premières dose')
            $('#card-full-descr').text(`Nombre de personnes ayant reçu au moins une dose en 24h.`)
            datasets = [
                {
                    label: 'Moyenne',
                    pointHitRadius: 20,
                    data: getRegression(new_first_dose),
                    fill: false,
                    borderColor: 'rgba(83, 204, 255, 0.5)',
                    tension: 0.2
                },
                {
                    label: 'Premières doses injectées',
                    pointHitRadius: 20,
                    data: new_first_dose,
                    fill: true,
                    borderColor: 'rgb(52, 226, 101)',
                    backgroundColor: gradient,
                    tension: 0.1
                }                
            ]
            break
        case 'deliveries':
            currLabels = deliveriesLabels
            $('#card-full-title').text('Livraisons')
            $('#card-full-descr').text(`Livraisons passées ou officiellement prévues pour les prochaines semaines par type de vaccin.`)
            datasets = [
                {
                    label: 'Pfizer',
                    data: deliveriesData["1"].nb_doses_cum,
                    fill: true,
                    borderColor: "#60c0a8",
                    backgroundColor: "#60c0a8",
                    tension: 0.1
                },
                {
                    label: 'Moderna',
                    data: deliveriesData["2"].nb_doses_cum,
                    fill: true,
                    borderColor: "#f0f0a8",
                    backgroundColor: "#f0f0a8",
                    tension: 0.1
                },
                {
                    label: 'AstraZeneca',
                    data: deliveriesData["3"].nb_doses_cum,
                    fill: true,
                    borderColor: "#ffa860",
                    backgroundColor: "#ffa860",
                    tension: 0.1
                },
                {
                    label: 'Janssen',
                    data: deliveriesData["4"].nb_doses_cum,
                    fill: true,
                    borderColor: "#3090c0",
                    backgroundColor: "#3090c0",
                    tension: 0.1
                }
            ]
            annotations = [
                {
                    type: 'line',
                    label: {
                        content: "Aujourd'hui",
                        enabled: true,
                        position: "top",
                        xPadding: 15
                    },
                    xMin: getTotalStock().id,
                    xMax: getTotalStock().id,
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 2
                }
              ]
            break
        case 'vaccinated-estimation':
            $('#card-full-title').text('Vaccinés prédiction')
            $('#card-full-descr').text(`Prédiction du nombre cumulé de personnes ayant reçu toutes les doses de vaccin requises sur 4 mois. Cette prédiction s'ajuste de jour en jour.`)
            currLabels = dates.concat(predictDates)
            var predictData = getPrediction(vaccins.slice(-2), predictDates.length + 1)
            var offset = vaccins[vaccins.length - 1] - predictData[0]
            datasets = [
                {
                    parsing: false,
                    label: 'Prediction',
                    pointHitRadius: 20,
                    data: predictData.map((value, idx) => ({
                        x: currLabels[dates.length - 1 + idx],
                        y: value + offset
                    })),
                    fill: false,
                    borderColor: 'rgba(83, 204, 255, 0.5)',
                    tension: 0.2,
                    borderDash: [3, 2],
                    cubicInterpolationMode: 'linear'
                },
                {
                    label: 'Vaccins',
                    pointHitRadius: 20,
                    data: vaccins.slice(-5),
                    fill: true,
                    borderColor: 'rgb(52, 226, 101)',
                    backgroundColor: gradient,
                    tension: 0.1
                }                
            ]
            annotations = [
                {
                    type: 'box',
                    borderWidth: 0,
                    xMin: 0,
                    xMax: dates.length - 1,
                    backgroundColor: 'rgba(190, 250, 209, 0.2)'
                },
                {
                    type: 'box',
                    borderWidth: 0,
                    xMin: dates.length - 1,
                    backgroundColor: 'rgba(159, 223, 245, 0.1)'
                },
                {
                    type: 'line',
                    label: {
                        content: "Aujourd'hui",
                        enabled: true,
                        position: "top",
                        xPadding: 15
                    },
                    xMin: dates.length - 1,
                    xMax: dates.length - 1,
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 2
                }
            ]
            break
        case 'first-dose-estimation':
            $('#card-full-title').text('Première dose prédiction')
            $('#card-full-descr').text(`Prédiction du nombre cumulé de personnes ayant reçu au moins une dose sur 4 mois. Cette prédiction s'ajuste de jour en jour.`)
            currLabels = dates.concat(predictDates)
            var predictData = getPrediction(first_dose.slice(-2), first_dose.length + 1)
            var offset = first_dose[first_dose.length - 1] - predictData[0]
            datasets = [
                {
                    parsing: false,
                    label: 'Prediction',
                    pointHitRadius: 20,
                    data: predictData.map((value, idx) => ({
                        x: currLabels[dates.length - 1 + idx],
                        y: value + offset
                    })),
                    fill: false,
                    borderColor: 'rgba(83, 204, 255, 0.5)',
                    tension: 0.2,
                    borderDash: [3, 2],
                    cubicInterpolationMode: 'linear'
                },
                {
                    label: 'Première Dose',
                    pointHitRadius: 20,
                    data: first_dose.slice(-5),
                    fill: true,
                    borderColor: 'rgb(52, 226, 101)',
                    backgroundColor: gradient,
                    tension: 0.1
                }                
            ]
            annotations = [
                {
                    type: 'box',
                    borderWidth: 0,
                    xMin: 0,
                    xMax: dates.length - 1,
                    backgroundColor: 'rgba(190, 250, 209, 0.2)'
                },
                {
                    type: 'box',
                    borderWidth: 0,
                    xMin: dates.length - 1,
                    backgroundColor: 'rgba(159, 223, 245, 0.1)'
                },
                {
                    type: 'line',
                    label: {
                        content: "Aujourd'hui",
                        enabled: true,
                        position: "top",
                        xPadding: 15
                    },
                    xMin: dates.length - 1,
                    xMax: dates.length - 1,
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 2
                }
            ]
            break
    }
    fullChart = new Chart(chrt, {
        type: 'line',
        data: {
            labels: currLabels,
            datasets
        },
        options: {            
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            responsive: true,
            plugins: {
                legend: {
                    display: cardName == "deliveries" ? true : false
                },
                annotation: {
                    annotations
                }        
            },
            elements: { point: { 
                radius: 0
             } },
            scales: {
                x: {
                    distribution: 'linear',
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: cardName == "deliveries" ? true : false,
                    ticks: {
                        count: 6                        
                    }
                }
            }                
        }
    })
}

function closeCard() {
    $('#home').show()
    $('#card-full').hide()
    $('#close-btn').hide()
}

function miniChart(chrt, data, chrtLabels, variation) {
    var gradient = chrt.createLinearGradient(0, 0, 0, $(chrt.canvas).innerHeight());
    if(variation > 0) {
        gradient.addColorStop(0, `rgba(190,250,209, 0.5)`)
        gradient.addColorStop(1, `rgba(190,250,209, 0)`)
    } else {
        gradient.addColorStop(0, `rgba(255,216,203, 0.5)`)
        gradient.addColorStop(1, `rgba(255,216,203, 0)`)
    }
    new Chart(chrt, {
        type: 'line',
        data: {
            labels: chrtLabels,
            datasets: [
                {
                    label: '',
                    data: data,
                    fill: true,
                    borderColor: variation > 0 ? 'rgb(52,226,101)' : 'rgb(255,97,52)',
                    backgroundColor: gradient,
                    tension: 0.1
                }
            ]
        },
        options:{
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            },
            elements: { point: { radius: 0 } },
            scales: {
                x: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    })
}

function miniPredictChart(chrt, data, chrtLabels) {
    var dates = chrtLabels.slice(-5)
    var predictDates = [new Date(dates[dates.length - 1]).addDays(5)]
    for(i = 0; i < 24; i++) {
        predictDates.push(new Date(predictDates[predictDates.length - 1]).addDays(5))
    }
    dates.forEach((el, i) => {
        var date = new Date(el)
        dates[i] = `${date.getDate()} ${monthsMin[date.getMonth()]}`
    })
    predictDates.forEach((el, i) => {
        var date = new Date(el)
        predictDates[i] = `${date.getDate()} ${monthsMin[date.getMonth()]}`
    })
    var currLabels = dates.concat(predictDates)
    var predictData = getPrediction(data.slice(-2), data.length + 1)
    var offset = data[data.length - 1] - predictData[0]
    new Chart(chrt, {
        type: 'line',
        data: {
            labels: currLabels,
            datasets: [
                {
                    parsing: false,
                    pointHitRadius: 20,
                    data: predictData.map((value, idx) => ({
                        x: currLabels[dates.length - 1 + idx],
                        y: value + offset
                    })),
                    fill: true,
                    borderColor: 'rgba(83, 204, 255, 0.5)',
                    backgroundColor: 'rgba(83, 204, 255, 0.1)',
                    tension: 0.2,
                    borderDash: [3, 2],
                    cubicInterpolationMode: 'linear'
                },
                {
                    pointHitRadius: 20,
                    data: data.slice(-5),
                    fill: true,
                    borderColor: 'rgb(52, 226, 101)',
                    backgroundColor: 'rgba(52, 226, 101, 0.1)',
                    tension: 0.1
                }
            ]
        },
        options:{
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            },
            elements: { point: { radius: 0 } },
            scales: {
                x: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    })
}

function datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

const getRegression = (data) => {
    let dataRegression = []
    data.forEach((element, index) => dataRegression.push([index, element]))
    return regression.polynomial(dataRegression).points
}

const getPrediction = (data, count) => {
    let dataRegression = []
    data.forEach((element, index) => dataRegression.push([index, element]))
    var reg = regression.linear(dataRegression)
    var result = []
    for(i = 0; i < count; i++) {
        result.push(reg.predict(i)[1])
    }
    return result
}

const getImmunityDate = () => {
    let dataRegression = []
    vaccins.slice(-3).forEach((element, index) => dataRegression.push([index, element]))
    var equation = regression.linear(dataRegression).equation
    var days = Math.ceil(((pop * immunity) - (equation[0] * 2 + equation[1])) / equation[0]) + 3
    return new Date(labelsDates.slice(-3)[0]).addDays(days)
}