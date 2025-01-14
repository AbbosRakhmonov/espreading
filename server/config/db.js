const { connect } = require("mongoose");

module.exports = async () => {
  try {
    return await connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};
