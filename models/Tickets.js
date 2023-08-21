const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    ticket_name: {
        type: String,
        required: true,
    },
    ticket_description: {
        type: String,
        required: true,
    },
    ticket_price: {
        type: String,
        required: true,
    },
    ticket_deadline: {
        type: String,
        required: true,
    },
    ticket_skills: {
        type: String,
        required: true,
    },
    ticket_upload: {
        type: Array,
    },
    ticket_status: {
        type: String,
    },
    ticket_winner: {
        type: String,
    },
    ticket_budget: {
        type: Number,
    },
    winner_avatar: {
        type: String,
    },
    winner_deadline: {
        type: String,
    },
    feedback: {
        type: String,
    },
    review: {
        type: String,
    },
});

module.exports = Tickets = mongoose.model("Tickets", TicketSchema);