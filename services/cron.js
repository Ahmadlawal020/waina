const cron = require("cron");
const https = require("https");

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URI, (res) => {
      if (res.statusCode == 200) console.log("GET REQUEST SENT SUCCESSFULLY");
      else console.log("Get Request failed", res.statusCode);
    })
    .on("error", (e) => console.error("ERROR while sending request", e));
});

module.exports = { job };
