import { Schema } from "mongoose";

const CallSchema = new Schema({
    caller:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    type:{
        type: String,
        enum: ['audio', 'video'],
        required: true,
    },
    status:{
        type: String,
        enum: ['ringing', 'in-progress', 'ended', 'missed'],
        default: 'ringing',
    },
    startTime:{
        type: Date,
        default: Date.now,
    },
    endTime:{
        type: Date,
    },
    duration:{
        type: Number, // duration in seconds
    }
},{
    timestamps: true
});

const Call = Schema.model('Call', CallSchema);

export default Call;