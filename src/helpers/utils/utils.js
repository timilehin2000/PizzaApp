const jwt = require("jsonwebtoken");

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
