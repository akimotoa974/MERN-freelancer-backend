const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.user_skypeid = !isEmpty(data.user_skypeid) ? data.user_skypeid : "";

    if (Validator.isEmpty(data.user_skypeid)){
        errors.name = "User Skype Id field is required";
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
};