const csvtojson = require('csvtojson')
const axios = require('axios').default
const forEach = require('foreach-promise')

module.exports = {
    get: (conn) => {
        axios.get('https://raw.githubusercontent.com/rozierguillaume/covid-19/master/data/france/donnees-vacsi-a-fra.csv', { responseType: 'blob'}).then((res) => {
            csvtojson({output:"line"}).fromString(res.data).then((data) => {
                conn.query('SELECT * FROM vaccin WHERE date=?', [
                    data[data.length - 1].split(';')[2]
                ], (err, exist) => {
                    if(err) throw err
                    if(exist.length == 0) {                        
                        var currDt = data[data.length - 1].split(';')
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
                })
            })
        })
    },
    getAll: (conn) => {
        axios.get('https://raw.githubusercontent.com/rozierguillaume/covid-19/master/data/france/donnees-vacsi-a-fra.csv', { responseType: 'blob'}).then((res) => {
            csvtojson({output:"line"}).fromString(res.data).then((data) => {
                forEach(data, (el) => {
                    var currDt = el.split(';')
                    if(parseInt(currDt[1]) == 0) {
                        conn.query('SELECT * FROM vaccin WHERE date=?', [
                            currDt[2]
                        ], (err, exist) => {
                            if(err) throw err
                            if(exist.length == 0) {                                
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
                        })
                    }
                })
            })
        })
    }
}