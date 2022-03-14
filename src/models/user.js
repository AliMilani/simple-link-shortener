const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

let userSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        minlength: 0,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 320,
        trim: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email address",
        },
    },
    phone: {
        type: String,
        maxlength: 15,
        trim: true,
        minlength: 10,
        required: true,
        unique: true,
        vlaidate: {
            validator: function (v) {
                return /(?=^09)\b\d{11}\b/.test(v);
            },
            message: "Please enter a valid phone number",
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 225,
        // set: (v) => bcrypt.hashSync(v, 10),
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            isAdmin: this.isAdmin,
        },
        config.get("jwtPrivateKey")
    );
    return token;
};
const User = mongoose.model("User", userSchema);

class ValidateUser {
    #joiSchema = Joi.object({
        name: Joi.string().min(0).max(50),
        email: Joi.string().min(7).max(320).required().email(),
        phone: Joi.string()
            .min(10)
            .max(15)
            .required()
            .regex(/^(?=^09)\b\d{11}\b/),
        password: Joi.string().min(6).max(225).required(),
        isAdmin: Joi.boolean(),
    });

    #makeSchemaOptional(schema) {
        let SchemaFields = schema._ids._byKey[Symbol.iterator]();
        let Felids = [];
        for (let field of SchemaFields) {
            Felids.push(field[0]);
        }
        return schema.fork(Felids, (field) => field.optional());
    }

    post(user) {
        return this.#joiSchema.validate(user);
    }

    put(user) {
        return this.#makeSchemaOptional(this.#joiSchema).validate(user);
    }
}

exports.User = User;
exports.validate = new ValidateUser();
