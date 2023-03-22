const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error : ${error}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
