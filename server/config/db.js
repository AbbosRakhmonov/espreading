const { connect } = require("mongoose");

module.exports = async () => {
  try {
    let mongoURI =
      process.env.NODE_ENV === "production"
        ? `mongodb+srv://abbosraxmonov2001:${process.env.MONGO_PASS}@espreading.fzesn.mongodb.net/?retryWrites=true&w=majority&appName=espreading`
        : process.env.MONGO_URI;

    return await connect(mongoURI);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
