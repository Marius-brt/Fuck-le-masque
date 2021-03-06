var mini_first_dose = $("#mini-first-dose")[0].getContext("2d");
var mini_first_dose_prediction = $("#mini-first-dose-estimation")[0].getContext(
  "2d"
);
var mini_second_dose_prediction = $(
  "#mini-second-dose-estimation"
)[0].getContext("2d");
var mini_third_dose_prediction = $("#mini-third-dose-estimation")[0].getContext(
  "2d"
);
var mini_new_first_dose = $("#mini-new-first-dose")[0].getContext("2d");
var mini_second_dose = $("#mini-second-dose")[0].getContext("2d");
var mini_new_second_dose = $("#mini-new-second-dose")[0].getContext("2d");
var mini_third_dose = $("#mini-third-dose")[0].getContext("2d");
var mini_new_third_dose = $("#mini-new-third-dose")[0].getContext("2d");
var deliveries = $("#deliveries-chart")[0].getContext("2d");
var injected_doses = $("#injected-doses")[0].getContext("2d");

var fullChart = null;

const pop = 66732538;
const immunity = 0.8;
var first_dose = [];
var second_dose = [];
var new_second_dose = [];
var third_dose = [];
var new_third_dose = [];
var new_first_dose = [];
var labels = [];
var dataAll = [];
var deliveriesData = {};
var injectedData = {};
var deliveriesLabels = [];
var labelsDates = [];
var first_dose_variation;
var new_first_dose_variation;
var second_dose_variation;
var new_second_dose_variation;
var third_dose_variation;
var new_third_dose_variation;

const monthsMin = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juill.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];
const months = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

$(".card-tooltip").click(function (e) {
  e.stopPropagation();
});

$(window).resize(() => {
  onResize();
});

$(document).ready(() => {
  onResize();
  $.ajax({
    url: "https://api.fucklemasque.fr/cov-data",
    type: "GET",
    success: (data) => {
      data.data.events.forEach((el) => {
        var diff = datediff(new Date(el.date));
        var htmlEvent = `<div class="event-card">
                <span class="event-date">${convertDate(el.date)}</span>
                ${
                  diff > 0
                    ? '<span class="event-countdown">Dans ' +
                      diff +
                      " jours</span>"
                    : ""
                }
                <p>${el.description}</p>
                </div>`;
        $("#all-events").append(htmlEvent);
        if (diff > 0) {
          $("#next-events").append(htmlEvent);
        }
      });
      if ($("#next-events").children().length == 0) {
        $("#next-events").append(
          `<p style="width:100%;text-align:center">Pas d'événement à venir</p>`
        );
      }

      dataAll = data.data.vaccins;
      var today = dataAll[dataAll.length - 1];
      var yesterday = dataAll[dataAll.length - 2];
      $("#percent_vaccin").text(`${round((today.vaccins * 100) / pop)}%`);
      $("#percent_vaccin_bar").height(`${round((today.vaccins * 100) / pop)}%`);
      $("#first_dose").text(numberWithSpaces(today.first_dose));
      $("#first_dose_today").text(`+${numberWithSpaces(today.new_first_dose)}`);
      $("#second_dose").text(numberWithSpaces(today.second_dose));
      $("#new_second_dose").text(`+${numberWithSpaces(today.new_second_dose)}`);
      $("#third_dose").text(numberWithSpaces(today.third_dose));
      $("#new_third_dose").text(`+${numberWithSpaces(today.new_third_dose)}`);
      $("#first-dose-pred").html(
        numberWithSpaces(today.first_dose) + "<span>(actuellement)</span>"
      );
      $("#second-dose-pred").html(
        numberWithSpaces(today.second_dose) + "<span>(actuellement)</span>"
      );
      $("#third-dose-pred").html(
        numberWithSpaces(today.third_dose) + "<span>(actuellement)</span>"
      );
      first_dose_variation = calcVariation(
        "first_dose_variation",
        today.first_dose,
        yesterday.first_dose
      );
      new_first_dose_variation = calcVariation(
        "new_first_dose_variation",
        today.new_first_dose,
        yesterday.new_first_dose
      );
      second_dose_variation = calcVariation(
        "second_dose_variation",
        today.second_dose,
        yesterday.second_dose
      );
      new_second_dose_variation = calcVariation(
        "new_second_dose_variation",
        today.new_second_dose,
        yesterday.new_second_dose
      );
      third_dose_variation = calcVariation(
        "third_dose_variation",
        today.third_dose,
        yesterday.third_dose
      );
      new_third_dose_variation = calcVariation(
        "new_third_dose_variation",
        today.new_third_dose,
        yesterday.new_third_dose
      );

      dataAll.forEach((el) => {
        var date = new Date(el.date);
        labels.push(
          `${date.getDate()} ${
            monthsMin[date.getMonth()]
          } ${date.getFullYear()}`
        );
        labelsDates.push(el.date);
        first_dose.push(el.first_dose);
        new_first_dose.push(el.new_first_dose);
        second_dose.push(el.second_dose);
        new_second_dose.push(el.new_second_dose);
        third_dose.push(el.third_dose);
        new_third_dose.push(el.new_third_dose);
      });

      $("#last-data").text(
        `Dernières données: ${convertDate(
          labelsDates[labelsDates.length - 1],
          false
        )}`
      );
      miniChart(mini_first_dose, first_dose, labels, first_dose_variation);
      miniChart(
        mini_new_first_dose,
        new_first_dose,
        labels,
        new_first_dose_variation
      );
      miniChart(mini_second_dose, second_dose, labels, second_dose_variation);
      miniChart(
        mini_new_second_dose,
        new_second_dose,
        labels,
        new_second_dose_variation
      );
      miniChart(mini_third_dose, third_dose, labels, third_dose_variation);
      miniChart(
        mini_new_third_dose,
        new_third_dose,
        labels,
        new_third_dose_variation
      );
      miniPredictChart(mini_first_dose_prediction, first_dose, labelsDates);
      miniPredictChart(mini_second_dose_prediction, second_dose, labelsDates);
      miniPredictChart(mini_third_dose_prediction, third_dose, labelsDates);
      $("#coll-first").text(numberWithSpaces(today.first_dose));
      $("#coll-first-bar").height(`${round((today.first_dose * 100) / pop)}%`);
      $("#coll-second").text(numberWithSpaces(today.second_dose));
      $("#coll-second-bar").height(
        `${round((today.second_dose * 100) / pop)}%`
      );
      $("#coll-third").text(numberWithSpaces(today.third_dose));
      $("#coll-third-bar").height(`${round((today.third_dose * 100) / pop)}%`);
      fetch(
        "https://raw.githubusercontent.com/rozierguillaume/vaccintracker/main/data/output/flux-total-nat.json",
        { cache: "no-cache" }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          deliveriesData = json;
          var deliveriesStock = getTotalStock();
          $("#deliveries").text(numberWithSpaces(deliveriesStock.value));
          $("#deliveries_variation").html(
            `${
              deliveriesStock.variation > 0
                ? '<i class="fas fa-arrow-up"></i>'
                : '<i class="fas fa-arrow-down"></i>'
            } ${numberWithSpaces(deliveriesStock.variation)}%`
          );
          $("#deliveries_variation").addClass(
            deliveriesStock.variation > 0 ? "var-p" : "var-n"
          );
          new Chart(deliveries, {
            type: "line",
            data: {
              labels: json.jour,
              datasets: [
                {
                  label: "Pfizer",
                  data: json["1"].jour.map((day, idx) => ({
                    x: day,
                    y: json["1"].nb_doses_cum[idx],
                  })),
                  fill: true,
                  borderColor: "#60c0a8",
                  backgroundColor: "#60c0a8",
                  tension: 0.1,
                },
                {
                  label: "Moderna",
                  data: json["2"].jour.map((day, idx) => ({
                    x: day,
                    y: json["2"].nb_doses_cum[idx],
                  })),
                  fill: true,
                  borderColor: "#f0f0a8",
                  backgroundColor: "#f0f0a8",
                  tension: 0.1,
                },
                {
                  label: "AstraZeneca",
                  data: json["3"].jour.map((day, idx) => ({
                    x: day,
                    y: json["3"].nb_doses_cum[idx],
                  })),
                  fill: true,
                  borderColor: "#ffa860",
                  backgroundColor: "#ffa860",
                  tension: 0.1,
                },
                {
                  label: "Janssen",
                  data: json["4"].jour.map((day, idx) => ({
                    x: day,
                    y: json["4"].nb_doses_cum[idx],
                  })),
                  fill: true,
                  borderColor: "#3090c0",
                  backgroundColor: "#3090c0",
                  tension: 0.1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: false,
                },
                legend: {
                  display: false,
                },
                annotation: {
                  annotations: [
                    {
                      type: "line",
                      label: {
                        content: "Aujourd'hui",
                        enabled: true,
                        position: "top",
                        font: {
                          size: 10,
                        },
                      },
                      xMin: deliveriesStock.id,
                      xMax: deliveriesStock.id,
                      borderColor: "rgb(0, 0, 0, 0.5)",
                      borderWidth: 2,
                    },
                  ],
                },
              },
              elements: { point: { radius: 0 } },
              scales: {
                x: {
                  ticks: {
                    display: false,
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                },
                y: {
                  stacked: true,
                  ticks: {
                    display: false,
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                },
              },
            },
          });
          deliveriesData.jour.forEach((el) => {
            var date = new Date(el);
            deliveriesLabels.push(
              `${date.getDate()} ${monthsMin[date.getMonth()]}`
            );
          });
        })
        .then(() => {
          fetch(
            "https://raw.githubusercontent.com/rozierguillaume/vaccintracker/main/data/output/vacsi-v-fra.json",
            { cache: "no-cache" }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("HTTP error " + response.status);
              }
              return response.json();
            })
            .then((json) => {
              injectedData = json;
              var N1 = injectedData["1"]["jour"].length - 1;
              var N2 = injectedData["2"]["jour"].length - 1;
              var N3 = injectedData["3"]["jour"].length - 1;
              var N4 = injectedData["4"]["jour"].length - 1;
              new Chart(injected_doses, {
                type: "pie",
                data: {
                  labels: injectedData.noms_vaccins,
                  datasets: [
                    {
                      data: [
                        injectedData["1"].n_cum_dose1[N1] +
                          injectedData["1"].n_cum_dose2[N1],
                        injectedData["2"].n_cum_dose1[N2] +
                          injectedData["2"].n_cum_dose2[N2],
                        injectedData["3"].n_cum_dose1[N3] +
                          injectedData["3"].n_cum_dose2[N3],
                        injectedData["4"].n_cum_dose1[N4] +
                          injectedData["4"].n_cum_dose2[N4],
                      ],
                      backgroundColor: [
                        "rgb(96, 192, 168)",
                        "rgb(255, 168, 96)",
                        "rgb(48, 144, 192)",
                        "rgb(240, 240, 168)",
                      ],
                      borderWidth: 0,
                    },
                  ],
                },
                options: {
                  plugins: {
                    legend: {
                      position: "bottom",
                      align: "center",
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                },
              });
            })
            .catch(() => {
              console.log("error-types");
            });
        })
        .catch(() => {
          console.log("error-types-livraisons");
        });
      var estimations_labels = [];
      var estimations_data = [];
      for (i = 0; i < 200; i += 20) {
        var startDate = new Date(today.date);
        var dt = startDate.addDays(i);
        estimations_labels.push(convertDate(dt));
        estimations_data.push((today.vaccins / today.id) * i + today.vaccins);
      }
    },
    error: (err) => {
      console.log(err);
    },
  });
});

function calcVariation(id, today, yesterday) {
  const variation = Math.trunc(((today - yesterday) / yesterday) * 100);
  $("#" + id).html(
    `${
      variation > 0
        ? '<i class="fas fa-arrow-up"></i>'
        : '<i class="fas fa-arrow-down"></i>'
    } ${numberWithSpaces(variation)}%`
  );
  $("#" + id).addClass(variation > 0 ? "var-p" : "var-n");
  return variation;
}

function showData() {
  $("#estimations-btn").addClass("active");
  $("#data-btn").removeClass("active");
  $("#estimations").show();
  $("#charts").hide();
}

function showEstimations() {
  $("#estimations-btn").removeClass("active");
  $("#data-btn").addClass("active");
  $("#estimations").hide();
  $("#charts").show();
}

function showNextEvents() {
  $("#next-events-btn").addClass("active");
  $("#all-events-btn").removeClass("active");
  $("#next-events").show();
  $("#all-events").hide();
}

function showAllEvents() {
  $("#next-events-btn").removeClass("active");
  $("#all-events-btn").addClass("active");
  $("#next-events").hide();
  $("#all-events").show();
}

function convertDate(inputFormat, min = true) {
  var d = new Date(inputFormat);
  if (min) {
    return `${d.getDate()} ${monthsMin[d.getMonth()]} ${d.getFullYear()}`;
  } else {
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
}

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function round(num) {
  return Math.round(num * 100) / 100;
}

function getTotalStock() {
  var idx_max = 0;
  let today = new Date();
  deliveriesData.jour.map((value, idx) => {
    if (new Date(value).addDays(-4) <= today) {
      idx_max = idx;
    }
  });
  return {
    day: getFormattedDate(new Date(deliveriesData.jour[idx_max]).addDays(-4)),
    value: deliveriesData.nb_doses_cum[idx_max],
    variation: Math.trunc(
      ((deliveriesData.nb_doses_cum[idx_max] -
        deliveriesData.nb_doses_cum[idx_max - 1]) /
        deliveriesData.nb_doses_cum[idx_max - 1]) *
        100
    ),
    id: idx_max,
  };
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function getFormattedDate(date) {
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  return month + "/" + day + "/" + year;
}

function showCard(cardName) {
  $("#home").hide();
  $("#card-full").show();
  $("#close-btn").show();
  if (fullChart) {
    fullChart.destroy();
  }
  var chrt = $("#full-chart")[0].getContext("2d");
  var annotations = [];
  var currLabels = labels;
  var currVariation = null;
  var datasets = null;
  var dates = labelsDates.slice(-5);
  var predictDates = [new Date(dates[dates.length - 1]).addDays(5)];
  for (i = 0; i < 24; i++) {
    predictDates.push(
      new Date(predictDates[predictDates.length - 1]).addDays(5)
    );
  }
  dates.forEach((el, i) => {
    var date = new Date(el);
    dates[i] = `${date.getDate()} ${
      monthsMin[date.getMonth()]
    } ${date.getFullYear()}`;
  });
  predictDates.forEach((el, i) => {
    var date = new Date(el);
    predictDates[i] = `${date.getDate()} ${
      monthsMin[date.getMonth()]
    } ${date.getFullYear()}`;
  });
  switch (cardName) {
    case "first-dose":
      currVariation = first_dose_variation;
      var colors = getChartColor(chrt, currVariation);
      datasets = [
        {
          label: "Première dose",
          pointHitRadius: 20,
          data: first_dose,
          fill: true,
          borderColor: colors.color,
          backgroundColor: colors.gradient,
          tension: 0.2,
        },
      ];
      $("#card-full-title").text("Première dose");
      $("#card-full-descr").text(
        `Nombre cumulé de personnes ayant reçu au moins une dose depuis le ${convertDate(
          dataAll[0].date,
          false
        )}.`
      );
      break;
    case "second-dose":
      currVariation = second_dose_variation;
      var colors = getChartColor(chrt, currVariation);
      datasets = [
        {
          label: "Deuxième dose",
          pointHitRadius: 20,
          data: second_dose,
          fill: true,
          borderColor: colors.color,
          backgroundColor: colors.gradient,
          tension: 0.2,
        },
      ];
      $("#card-full-title").text("Deuxième dose");
      $("#card-full-descr").text(
        `Nombre cumulé de personnes ayant reçu au moins deux doses depuis le ${convertDate(
          dataAll[0].date,
          false
        )}.`
      );
      break;
    case "third-dose":
      currVariation = third_dose_variation;
      var colors = getChartColor(chrt, currVariation);
      datasets = [
        {
          label: "Troisième dose",
          pointHitRadius: 20,
          data: third_dose,
          fill: true,
          borderColor: colors.color,
          backgroundColor: colors.gradient,
          tension: 0.2,
        },
      ];
      $("#card-full-title").text("Troisième dose");
      $("#card-full-descr").text(
        `Nombre cumulé de personnes ayant reçu au moins trois doses depuis le ${convertDate(
          dataAll[0].date,
          false
        )}.`
      );
      break;
    case "new-first-dose":
      $("#card-full-title").text("Premières doses aujourd'hui");
      $("#card-full-descr").text(
        `Nombre de personnes ayant reçu une dose en 24h.`
      );
      currVariation = new_first_dose_variation;
      var colors = getChartColor(chrt, currVariation);
      datasets = [
        {
          label: "Moyenne",
          pointHitRadius: 20,
          data: getRegression(new_first_dose),
          fill: false,
          borderColor: "rgba(83, 204, 255, 0.5)",
          tension: 0.2,
        },
        {
          label: "Premières doses injectées",
          pointHitRadius: 20,
          data: new_first_dose,
          fill: true,
          borderColor: colors.color,
          backgroundColor: colors.gradient,
          tension: 0.1,
        },
      ];
      break;
    case "new-second-dose":
      $("#card-full-title").text("Deuxièmes doses aujourd'hui");
      $("#card-full-descr").text(
        `Nombre de personnes ayant reçu une deuxième dose en 24h.`
      );
      currVariation = new_second_dose_variation;
      var colors = getChartColor(chrt, currVariation);
      datasets = [
        {
          label: "Moyenne",
          pointHitRadius: 20,
          data: getRegression(new_second_dose),
          fill: false,
          borderColor: "rgba(83, 204, 255, 0.5)",
          tension: 0.2,
        },
        {
          label: "Deuxièmes doses injectées",
          pointHitRadius: 20,
          data: new_second_dose,
          fill: true,
          borderColor: colors.color,
          backgroundColor: colors.gradient,
          tension: 0.1,
        },
      ];
      break;
    case "new-third-dose":
      $("#card-full-title").text("Troisièmes doses aujourd'hui");
      $("#card-full-descr").text(
        `Nombre de personnes ayant reçu une troisième dose en 24h.`
      );
      currVariation = new_third_dose_variation;
      var colors = getChartColor(chrt, currVariation);
      datasets = [
        {
          label: "Moyenne",
          pointHitRadius: 20,
          data: getRegression(new_third_dose),
          fill: false,
          borderColor: "rgba(83, 204, 255, 0.5)",
          tension: 0.2,
        },
        {
          label: "Troisièmes doses injectées",
          pointHitRadius: 20,
          data: new_third_dose,
          fill: true,
          borderColor: colors.color,
          backgroundColor: colors.gradient,
          tension: 0.1,
        },
      ];
      break;
    case "deliveries":
      currLabels = deliveriesLabels;
      currVariation = getTotalStock().variation;
      $("#card-full-title").text("Livraisons");
      $("#card-full-descr").text(
        `Livraisons passées ou officiellement prévues pour les prochaines semaines par type de vaccin.`
      );
      datasets = [
        {
          label: "Pfizer",
          data: deliveriesData["1"].nb_doses_cum,
          fill: true,
          borderColor: "#60c0a8",
          backgroundColor: "#60c0a8",
          tension: 0.1,
        },
        {
          label: "Moderna",
          data: deliveriesData["2"].nb_doses_cum,
          fill: true,
          borderColor: "#f0f0a8",
          backgroundColor: "#f0f0a8",
          tension: 0.1,
        },
        {
          label: "AstraZeneca",
          data: deliveriesData["3"].nb_doses_cum,
          fill: true,
          borderColor: "#ffa860",
          backgroundColor: "#ffa860",
          tension: 0.1,
        },
        {
          label: "Janssen",
          data: deliveriesData["4"].nb_doses_cum,
          fill: true,
          borderColor: "#3090c0",
          backgroundColor: "#3090c0",
          tension: 0.1,
        },
      ];
      annotations = [
        {
          type: "line",
          label: {
            content: "Aujourd'hui",
            enabled: true,
            position: "top",
            xPadding: 15,
          },
          xMin: getTotalStock().id,
          xMax: getTotalStock().id,
          borderColor: "rgb(0, 0, 0)",
          borderWidth: 2,
        },
      ];
      break;
    case "first-dose-estimation":
      $("#card-full-title").text("Première dose estimation");
      $("#card-full-descr").text(
        `Prédiction du nombre cumulé de personnes ayant reçu au moins une dose sur 4 mois. Cette estimation s'ajuste de jour en jour.`
      );
      currLabels = dates.concat(predictDates);
      var predictData = getPrediction(first_dose);
      datasets = [
        {
          parsing: false,
          label: "Prediction",
          pointHitRadius: 20,
          data: predictData.map((value, idx) => ({
            x: currLabels[dates.length - 1 + idx],
            y: value,
          })),
          fill: false,
          borderColor: "rgba(83, 204, 255, 0.5)",
          tension: 0.2,
          borderDash: [3, 2],
          cubicInterpolationMode: "linear",
        },
        {
          label: "Première Dose",
          pointHitRadius: 20,
          data: first_dose.slice(-5),
          fill: true,
          borderColor: "rgb(52, 226, 101)",
          backgroundColor: getChartColor(chrt, 1).gradient,
          tension: 0.1,
        },
      ];
      annotations = [
        {
          type: "box",
          borderWidth: 0,
          xMin: 0,
          xMax: dates.length - 1,
          backgroundColor: "rgba(190, 250, 209, 0.2)",
        },
        {
          type: "box",
          borderWidth: 0,
          xMin: dates.length - 1,
          backgroundColor: "rgba(159, 223, 245, 0.1)",
        },
        {
          type: "line",
          label: {
            content: "Aujourd'hui",
            enabled: true,
            position: "top",
            xPadding: 15,
          },
          xMin: dates.length - 1,
          xMax: dates.length - 1,
          borderColor: "rgb(0, 0, 0)",
          borderWidth: 2,
        },
      ];
      break;
    case "second-dose-estimation":
      $("#card-full-title").text("Deuxième dose estimation");
      $("#card-full-descr").text(
        `Prédiction du nombre cumulé de personnes ayant reçu au moins deux doses sur 4 mois. Cette estimation s'ajuste de jour en jour.`
      );
      currLabels = dates.concat(predictDates);
      var predictData = getPrediction(second_dose);
      datasets = [
        {
          parsing: false,
          label: "Prediction",
          pointHitRadius: 20,
          data: predictData.map((value, idx) => ({
            x: currLabels[dates.length - 1 + idx],
            y: value,
          })),
          fill: false,
          borderColor: "rgba(83, 204, 255, 0.5)",
          tension: 0.2,
          borderDash: [3, 2],
          cubicInterpolationMode: "linear",
        },
        {
          label: "Deuxième Dose",
          pointHitRadius: 20,
          data: second_dose.slice(-5),
          fill: true,
          borderColor: "rgb(52, 226, 101)",
          backgroundColor: getChartColor(chrt, 1).gradient,
          tension: 0.1,
        },
      ];
      annotations = [
        {
          type: "box",
          borderWidth: 0,
          xMin: 0,
          xMax: dates.length - 1,
          backgroundColor: "rgba(190, 250, 209, 0.2)",
        },
        {
          type: "box",
          borderWidth: 0,
          xMin: dates.length - 1,
          backgroundColor: "rgba(159, 223, 245, 0.1)",
        },
        {
          type: "line",
          label: {
            content: "Aujourd'hui",
            enabled: true,
            position: "top",
            xPadding: 15,
          },
          xMin: dates.length - 1,
          xMax: dates.length - 1,
          borderColor: "rgb(0, 0, 0)",
          borderWidth: 2,
        },
      ];
      break;
    case "third-dose-estimation":
      $("#card-full-title").text("Troisième dose estimation");
      $("#card-full-descr").text(
        `Prédiction du nombre cumulé de personnes ayant reçu au moins trois doses sur 4 mois. Cette estimation s'ajuste de jour en jour.`
      );
      currLabels = dates.concat(predictDates);
      var predictData = getPrediction(third_dose);
      datasets = [
        {
          parsing: false,
          label: "Prediction",
          pointHitRadius: 20,
          data: predictData.map((value, idx) => ({
            x: currLabels[dates.length - 1 + idx],
            y: value,
          })),
          fill: false,
          borderColor: "rgba(83, 204, 255, 0.5)",
          tension: 0.2,
          borderDash: [3, 2],
          cubicInterpolationMode: "linear",
        },
        {
          label: "Troisième Dose",
          pointHitRadius: 20,
          data: third_dose.slice(-5),
          fill: true,
          borderColor: "rgb(52, 226, 101)",
          backgroundColor: getChartColor(chrt, 1).gradient,
          tension: 0.1,
        },
      ];
      annotations = [
        {
          type: "box",
          borderWidth: 0,
          xMin: 0,
          xMax: dates.length - 1,
          backgroundColor: "rgba(190, 250, 209, 0.2)",
        },
        {
          type: "box",
          borderWidth: 0,
          xMin: dates.length - 1,
          backgroundColor: "rgba(159, 223, 245, 0.1)",
        },
        {
          type: "line",
          label: {
            content: "Aujourd'hui",
            enabled: true,
            position: "top",
            xPadding: 15,
          },
          xMin: dates.length - 1,
          xMax: dates.length - 1,
          borderColor: "rgb(0, 0, 0)",
          borderWidth: 2,
        },
      ];
      break;
  }
  if (currVariation) {
    $("#card-full-title").html(
      $("#card-full-title").text() + '<p id="full-chart-variation"></p>'
    );
    $("#full-chart-variation").removeClass("var-p var-n");
    $("#full-chart-variation").html(
      `${
        currVariation > 0
          ? '<i class="fas fa-arrow-up"></i>'
          : '<i class="fas fa-arrow-down"></i>'
      } ${numberWithSpaces(currVariation)}%`
    );
    $("#full-chart-variation").addClass(currVariation > 0 ? "var-p" : "var-n");
  }
  fullChart = new Chart(chrt, {
    type: "line",
    data: {
      labels: currLabels,
      datasets,
    },
    options: {
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      responsive: true,
      plugins: {
        legend: {
          display: cardName == "deliveries" ? true : false,
        },
        annotation: {
          annotations,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        x: {
          distribution: "linear",
          grid: {
            display: false,
          },
        },
        y: {
          stacked: cardName == "deliveries" ? true : false,
          ticks: {
            count: 6,
            min: 0,
          },
        },
      },
    },
  });
}

function onResize() {
  $("#last-data").css(
    "padding-left",
    `${$(".home-panel > .grid > .case:first").position().left}px`
  );
}

function getChartColor(ctx, variation) {
  var gradient = ctx.createLinearGradient(0, 0, 0, $(ctx.canvas).innerHeight());
  if (variation > 0) {
    gradient.addColorStop(0, `rgba(190,250,209, 0.7)`);
    gradient.addColorStop(1, `rgba(190,250,209, 0.2)`);
    return {
      gradient,
      color: `#00bf71`,
    };
  } else {
    gradient.addColorStop(0, `rgba(255,216,203, 0.7)`);
    gradient.addColorStop(1, `rgba(255,216,203, 0.2)`);
    return {
      gradient,
      color: `#ff6134`,
    };
  }
}

function closeCard() {
  $("#home").show();
  $("#card-full").hide();
  $("#close-btn").hide();
  onResize();
}

function miniChart(chrt, data, chrtLabels, variation) {
  var gradient = chrt.createLinearGradient(
    0,
    0,
    0,
    $(chrt.canvas).innerHeight()
  );
  if (variation > 0) {
    gradient.addColorStop(0, `rgba(190,250,209, 0.5)`);
    gradient.addColorStop(1, `rgba(190,250,209, 0)`);
  } else {
    gradient.addColorStop(0, `rgba(255,216,203, 0.5)`);
    gradient.addColorStop(1, `rgba(255,216,203, 0)`);
  }
  new Chart(chrt, {
    type: "line",
    data: {
      labels: chrtLabels,
      datasets: [
        {
          label: "",
          data: data,
          fill: true,
          borderColor: variation > 0 ? "rgb(52,226,101)" : "rgb(255,97,52)",
          backgroundColor: gradient,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
      },
      elements: { point: { radius: 0 } },
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    },
  });
}

function miniPredictChart(chrt, data, chrtLabels) {
  var dates = chrtLabels.slice(-5);
  var predictDates = [new Date(dates[dates.length - 1]).addDays(5)];
  for (i = 0; i < 24; i++) {
    predictDates.push(
      new Date(predictDates[predictDates.length - 1]).addDays(5)
    );
  }
  dates.forEach((el, i) => {
    var date = new Date(el);
    dates[i] = `${date.getDate()} ${monthsMin[date.getMonth()]}`;
  });
  predictDates.forEach((el, i) => {
    var date = new Date(el);
    predictDates[i] = `${date.getDate()} ${monthsMin[date.getMonth()]}`;
  });
  var currLabels = dates.concat(predictDates);
  var predictData = getPrediction(data);
  new Chart(chrt, {
    type: "line",
    data: {
      labels: currLabels,
      datasets: [
        {
          parsing: false,
          pointHitRadius: 20,
          data: predictData.map((value, idx) => ({
            x: currLabels[dates.length - 1 + idx],
            y: value,
          })),
          fill: true,
          borderColor: "rgba(83, 204, 255, 0.5)",
          backgroundColor: "rgba(83, 204, 255, 0.1)",
          tension: 0.2,
          borderDash: [3, 2],
          cubicInterpolationMode: "linear",
        },
        {
          pointHitRadius: 20,
          data: data.slice(-5),
          fill: true,
          borderColor: "rgb(52, 226, 101)",
          backgroundColor: "rgba(52, 226, 101, 0.1)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
      },
      elements: { point: { radius: 0 } },
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    },
  });
}

function datediff(date) {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.round((date - d.getTime()) / (1000 * 60 * 60 * 24));
}

const getRegression = (data) => {
  let dataRegression = [];
  data.forEach((element, index) => dataRegression.push([index, element]));
  const points = regression.polynomial(dataRegression).points;
  const points_res = [];
  for (const [i, el] of points) {
    if (el >= 0) points_res.push([i, el]);
    else points_res.push([i, 0]);
  }
  return points_res;
};

const getPrediction = (data) => {
  data = data.slice(-3);
  const factor = (data[data.length - 1] - data[0]) / (data.length * 5);
  const result = [];
  for (i = 5; i < 26 * 5; i += 5) {
    var res = Math.floor(data[data.length - 1] + factor * i);
    if (res > pop) result.push(pop);
    else result.push(res);
  }
  result.unshift(data[data.length - 1]);
  return result;
};

const getImmunityDate = () => {
  let dataRegression = [];
  vaccins.forEach((element, index) => dataRegression.push([index, element]));
  var equation = regression.linear(dataRegression).equation;
  var days = Math.ceil((pop * immunity + equation[0]) / equation[0]);
  return new Date(labelsDates[labelsDates.length - 1]).addDays(days);
};
