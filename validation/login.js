const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.user_id = !isEmpty(data.user_id) ? data.user_id : "";

    if (Validator.isEmpty(data.user_id)) {
        errors.email = "User Id field is required";
    } 

    return {
      errors,
      isValid: isEmpty(errors)
    };
}