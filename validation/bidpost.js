const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateBidpostinput(data) {
    let errors = {};

    data.bid_price = !isEmpty(data.bid_price) ? data.bid_price:"";
    data.bid_description = !isEmpty(data.bid_description) ? data.bid_description:"";
    data.bid_deadline = !isEmpty(data.bid_deadline) ? data.bid_deadline:"";

    if (Validator.isEmpty(data.bid_price)){
        errors.name = "Price field is required";
    }
    if (Validator.isEmpty(data.bid_description)){
        errors.name = "Description field is required";
    }

    if (Validator.isEmpty(data.bid_deadline)){
        errors.name = "Deadline field is required";
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
};