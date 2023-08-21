const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvatarSchema = new Schema({
    ava_url: {
        type: String,
        required: true,
    },
    ava_status: {
        type: Number,
    },
    ava_budget: {
        type: Number,
        required: true,
    },
    user_id: {
        type: String,
    },
    ava_level: {
        type: Number,
        required: true,
    } ,  
});

module.exports = Avatars = mongoose.model("Avatars", AvatarSchema);