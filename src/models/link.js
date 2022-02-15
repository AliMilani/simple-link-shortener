const bcrypt = require("bcryptjs");
const nanoid = require("nanoid");
const Joi = require("joi");
const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    url: {
        type: String,
        minlength: [4, "Url must be at least 3 characters"],
        maxlength: [2048, "Url is too long"],
        required: [true, "Url is required"],
        match: [
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Invalid url please submit valid url",
        ],
        validate: {
            validator: (v) => {
                // validate protocol if has :// it should be http or https
                if (v.indexOf("://") > -1) {
                    let protocol = v.split("://")[0];
                    if (protocol !== "http" && protocol !== "https") {
                        return false;
                    }
                }
                return true;
            },
            message: "Invalid url please submit valid url",
        },
    },
    slug: {
        type: String,
        default: () =>
            nanoid.customAlphabet(
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            )(6),
        unique: true,
        maxlength: [100, "Slug is too long"],
        minlength: [3, "Slug must be at least 3 characters"],
    },
    advancedSettings: {
        dateStart: {
            type: Date,
            default: Date.now,
        },
        dateEnd: {
            type: Date,
            validate: {
                validator: function (v) {
                    return (
                        Date.parse(v) >
                        Date.parse(this.advancedSettings.dateStart)
                    );
                },
                message: "Date end must be greater than date start",
            },
        },
        redirectCode: {
            type: Number,
            default: 302,
            enum: [[301, 302], "Redirect code must be 301 or 302"],
        },
        password: {
            type: String,
            maxlength: [500, "Password is too long"],
            set: (v) => v && bcrypt.hashSync(v, 10),
        },
    },
});

const Link = mongoose.model("Link", linkSchema);

const validateLink = (link) => {
    const schema = Joi.object({
        url: Joi.string()
            .min(4)
            .max(2048)
            .required()
            .regex(
                /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            ),
        slug: Joi.string().min(3).max(100),
        advancedSettings: {
            dateStart: Joi.date(),
            dateEnd: Joi.date(),
            redirectCode: Joi.number().valid(301, 302),
            password: Joi.string().max(500),
        },
    });
    return schema.validate(link);
};

module.exports.Link = Link;
module.exports.validate = validateLink;
