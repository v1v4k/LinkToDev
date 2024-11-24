const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const userAuth = async (req, res, next)=>{
    try{
        const {token} = req.cookies;

        if(!token){
            return res.status(401).send("Please Login")
        }

        const decodedToken = await jwt.verify(token, "vikram@123")

        const {id} = decodedToken;

        const user = await UserModel.findById(id);

        if(!user){
            throw new Error("User Not Found");
        }

        req.user = user;
        next();
}
catch(error){
    res.status(400).send(`Error : ${error.message}`);
}
}




module.exports = {    
    userAuth
}
