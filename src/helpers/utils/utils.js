const jwt = require("jsonwebtoken");

const axios = require("axios").default;

const fetchApi = require("./fetchApi");

class Utils {
    static generateToken(email) {
        return jwt.sign(
            {
                email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );
    }
}

module.exports = Utils;
