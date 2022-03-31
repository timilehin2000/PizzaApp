const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const dbURI =
    process.env.NODE_ENV === "production"
        ? process.env.PROD_DATABASE
        : process.env.DEV_DATABASE;

const connectDb = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Database is connected");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;
