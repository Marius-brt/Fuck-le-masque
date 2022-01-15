const axios = require("axios");
const util = require("util");

module.exports = {
  get: () => {
    const conn = require("../src/conn");
    const query = util.promisify(conn.query).bind(conn);
    axios({
      method: "get",
      url: "https://raw.githubusercontent.com/rozierguillaume/vaccintracker/main/data/output/vacsi-ndose-fra.json",
    })
      .then(async (resp) => {
        resp = resp.data;
        for await (const i of resp.jour.keys()) {
          let exist = await query("SELECT id FROM vaccin WHERE date=?", [
            resp.jour[i],
          ]);
          if (exist.length === 0) {
            conn.query(
              "INSERT INTO `vaccin`(`date`, `third_dose`, `new_third_dose`, `first_dose`, `new_first_dose`, `second_dose`, `new_second_dose`) VALUES (?,?,?,?,?,?,?)",
              [
                resp.jour[i],
                resp.n_cum_dose3[i],
                resp.n_dose3[i],
                resp.n_cum_dose1[i],
                resp.n_dose1[i],
                resp.n_cum_dose2[i],
                resp.n_dose2[i],
              ]
            );
          }
        }
        conn.end();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getAll: () => {
    const conn = require("../src/conn");
    axios({
      method: "get",
      url: "https://raw.githubusercontent.com/rozierguillaume/vaccintracker/main/data/output/vacsi-ndose-fra.json",
    })
      .then(async (resp) => {
        resp = resp.data;
        for await (const i of resp.jour.keys()) {
          conn.query(
            "INSERT INTO `vaccin`(`date`, `third_dose`, `new_third_dose`, `first_dose`, `new_first_dose`, `second_dose`, `new_second_dose`) VALUES (?,?,?,?,?,?,?)",
            [
              resp.jour[i],
              resp.n_cum_dose3[i],
              resp.n_dose3[i],
              resp.n_cum_dose1[i],
              resp.n_dose1[i],
              resp.n_cum_dose2[i],
              resp.n_dose2[i],
            ]
          );
        }
        conn.end();
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
