import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        videoId: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Comment", CommentSchema); 