const cron = require("node-cron");
const backendUrl = "https://espreading.onrender.com";

cron.schedule("*/14 * * * *", async () => {
  try {
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = cron;
