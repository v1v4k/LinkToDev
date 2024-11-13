const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validatePasswordStrong } = require('../helper/validation');
const bcrypt = require('bcrypt');


// profile API
profileRouter.get("/profile",userAuth, async (req, res)=>{
    try{
            const user = req.user;
            res.send(user);
    }
    catch(error){
        res.status(400).send(`Error: ${error.message}`)
    }   

})

// profile edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res)=> {
    try{
        if(!validateEditProfileData(req)){
            throw new Error(`Invalid Edit Request`);
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message:`${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        })


    }
    catch(error){
        res.status(400).send(`Error : ${error.message}`);
    }
})

// password API
profileRouter.patch("/profile/password", userAuth, async (req, res)=> {
try{ 

    const user = req.user;
    
    const { password : oldPasswordByUser, newPassword : newPasswordByUser} = req.body;
    console.log(oldPasswordByUser)

  
    const isOldPasswordValid = await user.validatePassword(oldPasswordByUser);
    const isNewPasswordStrong = validatePasswordStrong(newPasswordByUser);

    if(isOldPasswordValid &&  isNewPasswordStrong){ 

        const passwordHash = await bcrypt.hash(newPasswordByUser, 10);

       
       console.log(passwordHash)

        user.password = passwordHash;

        await user.save();

        res.json({
            message:"Password Updated Successfully"
        })     
        
    }
    else{
        throw new Error("Wrong Password");
    }

}
catch(error){
        res.status(400).send(`Error: ${error.message}`);
}

})

module.exports = profileRouter;