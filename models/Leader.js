const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaderSchema = new Schema({
    Leader_id: {
        type: String,
        required: true,
    },
    Leader_budget: {
        type: Number,
    },
    Leader_success: {
        type: Number,
    },
    Leader_avatar: {
        type: String,
    },
    Leader_Name: {
        type: String,
    }
});

module.exports = Leaders = mongoose.model("Leaders", LeaderSchema);