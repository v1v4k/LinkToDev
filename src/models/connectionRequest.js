const mongoose = require(`mongoose`);

const connectionReqSchema = new mongoose.Schema(
{
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true 
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status : {
        type : String,
        enum : {
            values:["ignored", "interested", "accepted", "rejected"],
            message : `${VALUE} is incorrect status type`
        }
    }
},
{timestamps: true}
)

const ConnectionReqModel = new mongoose.Model("ConnectionReqModel", connectionReqSchema);

module.exports = ConnectionReqModel;