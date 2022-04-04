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
}

module.exports = OrderValidation;

// let Joi = require("joi");
// let service = Joi.object().keys({
//     serviceName: Joi.string().required(),
// });

// let services = Joi.array().items(service);

// let test = Joi.validate(
//     [{ serviceName: "service1" }, { serviceName: "service2" }],
//     services
// );
