const validator  = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    const requiredData = ["emailId", "password", "firstName", "lastName"];

    const isrequiredData = requiredData.every((key)=>Object.keys(req.body).includes(key));

    if(!isrequiredData){
            throw new Error("Missing any of must required fields")
    }

    if(!firstName || !lastName ){
        throw new Error("Invalid Username")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid emailId")
    }
    else if(!validatePassword(password)){
        throw new Error("password too weak")

    }

}

const validateEditProfileData = (req) => {
    
        const allowedProfileEdits =  ["firstName", "lastName","gender", "age", "skills", "about", "photoUrl"]

        const isProfileEditAllowed = Object.keys(req.body).every(key=>allowedProfileEdits.includes(key))

        return isProfileEditAllowed;
    
}


const validatePasswordStrong = (password) => {
    
    if(validator.isStrongPassword(password)){
        return true;
    }
    else{
        throw new Error("Password too weak");
    }

    
    
}
module.exports = {validateSignUpData, validateEditProfileData, validatePasswordStrong};