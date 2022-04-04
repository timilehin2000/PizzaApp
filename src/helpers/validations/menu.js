const Joi = require("joi");

class MenuValidation {
    static validateCreateMenuPayload = (data) => {
        const schema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            description: Joi.string().required(),
            shippingPrice: Joi.number(),
        });
        return schema.validate(data);
    };
}

module.exports = MenuValidation;
