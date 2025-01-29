import mongoose, { Schema, Document, model, Types } from 'mongoose';

export interface Chat {
    _id:string
    date: Date;
    message: string;
    from: string;
}

export interface Conversation {
    _id:string
    conversationTitle: string
    date: Date
    chats: Chat[]
    userId: string
    repositoryId: string
}

export interface IConversation extends Omit<Conversation, "userId" | "repositoryId"|"_id">, Document {
    userId: Types.ObjectId
    repositoryId: Types.ObjectId
}

const ChatSchema = new Schema<Chat>({
    date: { type: Date, required: true },
    message: { type: String, required: true },
    from: { type: String, required: true }
});

const ConversationSchema = new Schema<IConversation>({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    conversationTitle: { type: String, required: true },
    date: { type: Date, default: Date.now },
    chats: { type: [ChatSchema], required: true },
    repositoryId: { type: Schema.ObjectId, ref: 'Repository', required: true }
});

const ConversationModel = mongoose.models.Conversation || model<IConversation>('Conversation', ConversationSchema);

export default ConversationModel;
