const Joi = require("joi");

class UserValidation {
    static validateUserRegistration = (data) => {
        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] },
            }),
            password: Joi.string().required(),
            address: Joi.string().required(),
        });
        return schema.validate(data);
    };

    static validateUserLogin = (data) => {
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] },
            }),
            password: Joi.string().required(),
        });
        return schema.validate(data);
    };
}

module.exports = UserValidation;
