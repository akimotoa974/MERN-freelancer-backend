const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BidSchema = new Schema({
    ticket_id: {
        type: String,
        required: true,
    },
    bid_price: {
        type: String,
        required: true,
    },
    bid_deadline: {
        type: String,
        required: true,
    },
    bid_description: {
        type: String,
        required: true,
    },
    bider_id: {
        type: String,
        required: true,
    } ,  
    bider_url: {
        type: String,
    }
});

module.exports = Bids = mongoose.model("Bids", BidSchema);