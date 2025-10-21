import {Schema} from 'mongoose';

// Status can be 'online', 'offline', 'away', 'busy'
const statusEnum = ['online', 'offline', 'away', 'busy'];

const UserSchema = new Schema({
    userName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
    },
    status:{
        type: String,
        enum: statusEnum,
        default: 'offline'
    },
    lastSeen:{
        type: Date,
    },
    contacts:{
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    blockedUsers:{
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
},{
    timestamps: true
});

const User = Schema.model('User', UserSchema);

export default User;