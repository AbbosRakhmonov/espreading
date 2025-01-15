const { connect } = require("mongoose");

module.exports = async () => {
  try {
    console.log(process.env.NODE_ENV);

    let mongoURI =
      process.env.NODE_ENV === "production"
        ? `mongodb+srv://abbosraxmonov2001:${process.env.MONGO_PASS}@espreading.fzesn.mongodb.net/?retryWrites=true&w=majority&appName=espreading`
        : process.env.MONGO_URI;
    return await connect(mongoURI);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};
