const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user");

const auth = async (req, res, next) => {
    if (req.headers["x-access-token"] || req.headers.authorization) {
        const token =
            (await req.headers["x-auth-token"]) ||
            (await req.headers.authorization.replace("Bearer ", ""));

        try {
            const verifiedUser = await jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await UserModel.findOne({ token });

            if (!user)
                return res.status(401).json({ message: "Access Denied" });

            req.user = user;
            req.token = token;

            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({ message: "Access Denied" });
        }
    } else {
        return res.status(401).json({ message: "Access Denied" });
    }
};

module.exports = auth;
