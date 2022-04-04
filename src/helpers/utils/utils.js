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
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
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
        let APIUrl = `https://api.paystack.co/transaction/verify/${referenceId}`;

        let requestHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        };

        const getResponse = async () => {
            const { isError, data, errorMessage } = await fetchApi(
                {},
                "GET",
                APIUrl,
                requestHeaders
            );

            if (isError) {
                return { errorMessage, isError };
            } else {
                console.log("is", data);
                return { data: data.data.data };
            }
        };

        const response = await getResponse();
        return response;
    }
}

module.exports = Utils;
