const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myDB");
    console.log("DB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
};

module.exports = connectDB;
