// const axios = require("axios");

// const sendTermiiSMS = async (to, message) => {
//   try {
//     const response = await axios.post(
//       "https://api.ng.termii.com/api/sms/send",
//       {
//         to: to.startsWith("0") ? `234${to.slice(1)}` : to,
//         from: "Masa Treat", // Replace with your approved Termii sender ID
//         sms: message,
//         type: "plain",
//         channel: "generic",
//         api_key: process.env.TERMII_API_KEY,
//       }
//     );

//     if (response.data.code === "ok") {
//       console.log(`SMS sent to ${to}`);
//     } else {
//       console.error(`Failed to send SMS to ${to}: ${response.data.message}`);
//     }
//   } catch (error) {
//     console.error("Error sending Termii SMS:", error.message);
//   }
// };

// module.exports = sendTermiiSMS;

const axios = require("axios");

const sendTermiiSMS = async (to, message) => {
  try {
    const response = await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      {
        to: to.startsWith("0") ? `234${to.slice(1)}` : to,
        from: "Masa Treat", // Must be approved by Termii
        sms: message,
        type: "plain",
        channel: "dnd", // Changed from "generic" to "dnd"
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


