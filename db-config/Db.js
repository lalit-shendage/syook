const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DB_URL = process.env.MONGO_DB_URL;

const connectToDatabase = () => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      console.error("Database connection error:", error);
    });
};

module.exports = connectToDatabase;
