import mongoose from 'mongoose';

const blogReviewSchema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: true,
        },
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            enum: ['APPROVED', 'REJECTED'],
            required: true,
        },
        reason: {
            type: String,
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for querying reviews by blog
blogReviewSchema.index({ blog: 1, reviewedAt: -1 });

const BlogReview = mongoose.model('BlogReview', blogReviewSchema);

export default BlogReview;
