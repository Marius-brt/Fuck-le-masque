require("dotenv").config();
const express = require("express");
const app = express();
const conn = require("./src/conn");
const cors = require("cors");
const cron = require("node-cron");

require("./data/getData").get();

cron.schedule("0 20 * * *", () => {
  require("./data/getData").get();
});

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hi !");
});

app.get("/cov-data", (req, res) => {
  conn.query(
    "SELECT * FROM vaccin WHERE MOD(id,5)=0 OR id=(SELECT max(id) FROM vaccin) OR id=((SELECT max(id) FROM vaccin) - 1) OR id=(SELECT min(id) FROM vaccin) ORDER BY `date` ASC",
    (err, data) => {
      if (err) throw err;
      conn.query("SELECT * FROM events ORDER BY `date` ASC", (err, events) => {
        if (err) throw err;
        res.status(200).json({
          status: "ok",
          data: {
            vaccins: data,
            events,
          },
        });
      });
    }
  );
});

app.listen(3000, () => {
  console.log("Server started !");
});
