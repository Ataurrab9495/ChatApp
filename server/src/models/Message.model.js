import { Schema } from "mongoose";

const MessageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content:{
        type: String,
    },
    type:{
        type: String,
        enum: ['text', 'image', 'video', 'file'],
        default: 'text',
    },
    mediaUrl:{
        type: String,
    },
    replyTo:{
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    readBy:[{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    deletedFor:{
        type: [Schema.Types.ObjectId],
        ref: 'User',
    }
},{
    timestamps: true
});

const Message = Schema.model('Message', MessageSchema);

export default Message;