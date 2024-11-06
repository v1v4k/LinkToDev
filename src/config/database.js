const  {USER_NAME_DB , PASSWORD_DB } = require("../utils/constants");
const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(`mongodb+srv://${USER_NAME_DB}:${PASSWORD_DB}@khansaar.izn77.mongodb.net/LinkToDev`)
}

module.exports = connectDB;

