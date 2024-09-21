const mongoose = require('mongoose');

const connectDB = (url) => {
  console.log("CONNECTED TO DB");
  return mongoose.connect(url);
};

module.exports = connectDB;
