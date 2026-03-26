import mongoose, {Schema} from "mongoose";
import  { MemberStatus, MemberType } from "../libs/enums/member.enum"

// memberschemani 2 xil usulda qursa buladi 1-Schema first va Code first orqali quriladi bu qurganimiz schama based
const memberSchema = new Schema(
    {
    memberType: {
        type: String,
        enum: MemberType,
        default: MemberType.USER
    },

    memberStatus: {
        type: String, 
        enum: MemberStatus,
        default: MemberStatus.ACTIVE
        
    },

    memberNick: {
        type: String,
        index: {unique: true, sparse: true},
        required: true,
    },

    memberPhone: {
        type:String,
        index: {unique: true, sparse: true},
        required: true,
    },


    memberPassword: {
        type: String,
        select: false,
        required: true,
    },
    memberAddress: {
        type: String,

    },

    memberDesc: {
        type: String,
    },

    memberImage: {
        type: String,
    },

    memberPoints: {
        type: Number,
        default: 0,

    },

}, {timestamps: true} // updatedAt, createdAt bu bizda updatedAt va createdAt qachon hosil bulganini quyib beradi
);

export default mongoose.model('Member', memberSchema);
