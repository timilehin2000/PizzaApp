const Joi = require("joi");

class OrderValidation {
    static validateMakeOrderPayload = (data) => {
        const schema = Joi.array().items(
            Joi.object({
                menuId: Joi.string().required(),
                quantity: Joi.number().required(),
            })
        );
        return schema.validate(data);
    };

    static validateIntializePayment = (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
            amount: Joi.number().required(),
            orderId: Joi.string().required(),
        });
        return schema.validate(data);
    };

    static validateCompletePayment = (data) => {
        const schema = Joi.object({
            referenceId: Joi.string().required(),
            orderId: Joi.string().required(),
        });
        return schema.validate(data);
    };
}

module.exports = OrderValidation;
