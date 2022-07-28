const mongoose = require("mongoose");
const logger = require("tracer").console();

const connect = () => {
  return new Promise((resolve) => {
    try {
      mongoose.connect(process.env.MONGO_URL, (err) => {
        if (err) {
          logger.log(`Error connecting to Database: ${err}`);
          process.exit(1);
        } else {
          logger.log("Connected to Database...");
          resolve();
        }
      });
    } catch (err) {
      logger.log(`Error connecting to Database: ${err}`);
      process.exit(1);
    }
  });
};

const close = () => {
  return mongoose.disconnect();
};

module.exports = { connect, close };
