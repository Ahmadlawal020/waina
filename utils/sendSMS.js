// const axios = require("axios");

// const TERMII_API_KEY = process.env.TERMII_API_KEY;
// const SENDER_ID = "InfoAlert"; // or your approved sender name

// const sendSMS = async (to, message) => {
//   try {
//     const res = await axios.post("https://api.ng.termii.com/api/sms/send", {
//       to,
//       from: SENDER_ID,
//       sms: message,
//       type: "plain",
//       channel: "generic",
//       api_key: TERMII_API_KEY,
//     });

//     if (res.data.code === "ok") {
//       console.log(`✅ SMS sent to ${to}`);
//     } else {
//       console.error(`❌ Failed to send SMS: ${res.data.message}`);
//     }
//   } catch (error) {
//     console.error(
//       "❌ Error sending SMS:",
//       error.response?.data || error.message
//     );
//   }
// };

// module.exports = sendSMS;

const axios = require("axios");

const sendTermiiSMS = async (to, message) => {
  try {
    const response = await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      {
        to: to.startsWith("0") ? `234${to.slice(1)}` : to,
        from: "Masa Treat", // Replace with your approved Termii sender ID
        sms: message,
        type: "plain",
        channel: "generic",
        api_key: process.env.TERMII_API_KEY,
      }
    );

    if (response.data.code === "ok") {
      console.log(`SMS sent to ${to}`);
    } else {
      console.error(`Failed to send SMS to ${to}: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error sending Termii SMS:", error.message);
  }
};

module.exports = sendTermiiSMS;
