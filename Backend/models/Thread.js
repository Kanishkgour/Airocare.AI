import mongoose, { mongo } from 'mongoose';

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        require: true
    },
    content: {
        type: String,
        require: true
    },
    timestamp: {
        type: String,
        default: Date.now
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        require: true,
        // unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export default  mongoose.model("Thread" , ThreadSchema);