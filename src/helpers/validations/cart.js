const Joi = require("joi");

class CartValidation {
    static addMenuToCartValidation = (data) => {
        const schema = Joi.object({
            menuId: Joi.string().required(),
            quantity: Joi.number().required(),
        });
        return schema.validate(data);
    };

    static removeMenuFromCartValidation = (data) => {
        const schema = Joi.object({
            menuId: Joi.string().required(),
            quantity: Joi.number(),
        });
        return schema.validate(data);
    };
}

module.exports = CartValidation;
