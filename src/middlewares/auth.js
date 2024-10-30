const adminAuth = (req, res,next)=>{
        const token = "ABCD";
    
        const isAdminAuthorized = token === "ABCD";
    
        if(!isAdminAuthorized){
            res.status(401).send("Unauthorzed")
        }
        else{
            next();
        }
}

const userAuth = (req, res, next)=>{
    const token = "XYZ";

    const isUserAuthorized = token === "XYZ";

    if(!isUserAuthorized){
        res.status(401).send("Unauthorized User")
    }
    else{
        next();
    }
}




module.exports = {
    adminAuth,
    userAuth
}
