const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateTaskpostinput(data) {
    let errors = {};

    data.ticket_name = !isEmpty(data.ticket_name) ? data.ticket_name:"";
    data.ticket_description = !isEmpty(data.ticket_description) ? data.ticket_description:"";
    data.ticket_price = !isEmpty(data.ticket_price) ? data.ticket_price:"";
    data.ticket_deadline = !isEmpty(data.ticket_deadline) ? data.ticket_deadline:"";
    data.ticket_skills = !isEmpty(data.ticket_skills) ? data.ticket_skills:"";


    if (Validator.isEmpty(data.ticket_name)){
        errors.name = "Ticket Name is required";
    }
    if (Validator.isEmpty(data.ticket_description)){
        errors.name = "Ticket Description field is required";
    }

    if (Validator.isEmpty(data.ticket_price)){
        errors.name = "Ticket Price field is required";
    }
    if (Validator.isEmpty(data.ticket_deadline)){
        errors.name = "Ticket Deadline field is required";
    }
    if (Validator.isEmpty(data.ticket_skills)){
        errors.name = "Ticket Skills field is required";
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
};