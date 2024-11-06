const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    },
    emailId : {
        type: String
    },
    passeord : {
        type : String
    }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;