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

    static async initializeTransaction(params) {
        let APIUrl = "https://api.paystack.co/transaction/initialize";

        let requestHeaders = {
            "Content-Type": "application/json",
        };

        const getResponse = async () => {
            const { isError, data, errorMessage } = await fetchApi(
                params,
                "POST",
                APIUrl,
                requestHeaders
            );

            if (isError) {
                return { errorMessage, isError };
            } else {
                return { data: data.data.data };
            }
        };

        const response = await getResponse();
        return response;
    }

    static async verifyTransaction(referenceId) {
        let APIUrl = `https://api.paystack.co/transaction/verify/:reference`;

        let requestHeaders = {
            "Content-Type": "application/json",
        };

        const getResponse = async () => {
            const { isError, data, errorMessage } = await fetchApi(
                { referenceId },
                "POST",
                APIUrl,
                requestHeaders
            );

            if (isError) {
                return { errorMessage, isError };
            } else {
                return { data: data.data.data };
            }
        };

        const response = await getResponse();
        return response;
    }
}

module.exports = Utils;
