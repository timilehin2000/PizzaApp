const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/database");
const UserRoutes = require("./routes/user.routes");

const app = express();

//middlewares
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

//handle cors here
app.use(cors());

//route
app.use("/api/v1", UserRoutes);

//handle unwanted route
app.use("/*", (req, res) => {
    // console.log(req, res);
    res.status(404).json({
        message: "lol, You missed the right route",
        route: req.originalUrl,
    });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log("app is running");

    connectDb();
});
