const jwt = require("jsonwebtoken");

class Utils {
    static generateToken(user) {
        return jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );
    }
}

module.exports = Utils;
