const csvtojson = require('csvtojson')
const axios = require('axios').default
const forEach = require('foreach-promise')

module.exports = {
    get: () => {
        axios.get('https://raw.githubusercontent.com/rozierguillaume/covid-19/master/data/france/donnees-vacsi-a-fra.csv', { responseType: 'blob'}).then((res) => {
            csvtojson({output:"line"}).fromString(res.data).then((data) => {
                const conn = require('../src/conn')
                var yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date)
                var currDt = data.find((el) => {
                    el = el.split(';')
                    var elDate = new Date(el[2])
                    return elDate.getDate() == yesterday.getDate() &&
                    elDate.getMonth() == yesterday.getMonth() &&
                    elDate.getFullYear() == yesterday.getFullYear() && parseInt(el[1]) == 0
                })
                conn.query("INSERT INTO `vaccin`(`date`, `vaccins`, `new_vaccins`, `first_dose`, `new_first_dose`) VALUES (?,?,?,?,?)", [
                    currDt[2],
                    currDt[6],
                    currDt[4],
                    currDt[5],
                    currDt[3]
                ], (err) => {
                    if(err) throw err
                    conn.end()
                })
            })
        })
    },
    getAll: () => {
        axios.get('https://raw.githubusercontent.com/rozierguillaume/covid-19/master/data/france/donnees-vacsi-a-fra.csv', { responseType: 'blob'}).then((res) => {
            csvtojson({output:"line"}).fromString(res.data).then((data) => {
                const conn = require('../src/conn')
                forEach(data, (el) => {
                    var currDt = el.split(';')
                    if(parseInt(currDt[1]) == 0) {
                        conn.query("INSERT INTO `vaccin`(`date`, `vaccins`, `new_vaccins`, `first_dose`, `new_first_dose`) VALUES (?,?,?,?,?)", [
                            currDt[2],
                            currDt[6],
                            currDt[4],
                            currDt[5],
                            currDt[3]
                        ], (err) => {
                            if(err) throw err
                        })
                    }
                }).then(() => {
                    conn.end()
                })
            })
        })
    }
}