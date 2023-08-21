const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvatarRequestSchema = new Schema({
    Avatar_url: {
        type: String,
    },
    request_id: {
        type: String,
    },
    status: {
    	type: String,
    }
});

module.exports = AvatarRequests = mongoose.model("AvatarRequest", AvatarRequestSchema);