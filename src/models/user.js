const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        minLength : 3,
        maxLength : 50,
        required : true
    },
    lastName : {
        type : String,
        minLength : 3,
        maxLength : 50,
        required : true
    },
    age : {
        type : Number,
        min: 18,
        required : true
    },
    gender : {
        type : String,
        validate(value){
            if(!["Male", "Female", "Others"].includes(value)){
                throw new Error("Gender Data is not valid");
            }
        },
        required : true
    },
    emailId : {
        type: String,
        lowercase : true,
        unique : true,
        required : true,
        trim : true
    },
    password : {
        type : String,
        minLength : 8,
        required : true
    },
    skills : {
        type : [String]
    },
    photoUrl : {
        type : String,
        default : "https://www.pngkey.com/png/detail/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
    },
    about : {
        type : String,
        default : "It's about you"
    }
},
{
    timeStamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;