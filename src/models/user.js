const mongoose = require("mongoose");
const validator  = require("validator");

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
        max : 100,
        required : true
    },
    gender : {
        type : String,
        validate(value){
            if(!["Male", "Female", "Others"].includes(value)){
                throw new Error(`Gender Data is not valid ${value}`);
            }
        },
        required : true
    },
    emailId : {
        type: String,
        maxLength: 25,
        lowercase : true,
        unique : true,
        required : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`Invalid emailId ${value}`)
            }
        }
    },
    password : {
        type : String,
        minLength : 8,
        maxLength : 15,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error(`Invalid Password  ${value}`)
            }
        }
    },
    skills : {
        type : [String]
    },
    photoUrl : {
        type : String,
        default : "https://www.pngkey.com/png/detail/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error(`Invalid URL ${value}`)
            }
        }
    },
    about : {
        type : String,
        default : "It's about you",
        maxLength : 250
    }
},
{
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;