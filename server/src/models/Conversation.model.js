import { Schema } from "mongoose";


const ConversationSchema = new Schema({
    type: {
        type: String,
        enum: ['private', 'group'],
        required: true,
    },
    participants: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true,
    },
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name:{
        type: String,
    },
    avatar:{
        type: String,
    },
    lastMessage:{
        type: Schema.Types.ObjectId,
        ref: 'Message',
    }
},{
    timestamps: true
});

const Conversation = Schema.model('Conversation', ConversationSchema);

export default Conversation;