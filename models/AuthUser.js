const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    password: {
        type: String,
    },

    user_id: {
        type: String,
    },

    user_skypeid: {
        type: String,
        required: true
    },

    access: {
        type: String,
    }

});

module.exports = AuthUser = mongoose.model("authusers", UserSchema);