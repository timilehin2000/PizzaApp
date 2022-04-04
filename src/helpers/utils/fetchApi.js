const parseError = require("./parseError");

const axios = require("axios").default;

const defaultHeaders = {
    "Content-Type": "application/json",
};
/**
 *
 * @param {any} dataObject
 * @returns Promise<{ isError : boolean; data?: { message : { data : any }}; errorMessage ?: string}>
 */

const fetchApi = async (dataObject, method, url, headers = defaultHeaders) => {
    try {
        const data = await axios({
            method,
            url,
            data: dataObject,
            headers,
        });

        return { isError: false, data };
    } catch (error) {
        return parseError(error);
    }
};

module.exports = fetchApi;
