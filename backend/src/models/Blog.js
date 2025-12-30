import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            maxlength: [500, 'Excerpt cannot exceed 500 characters'],
        },
        coverImage: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'],
            default: 'DRAFT',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Styling options
        fontFamily: {
            type: String,
            default: 'Inter',
        },
        fontSize: {
            type: Number,
            default: 16,
            min: 12,
            max: 24,
        },
        fontColor: {
            type: String,
            default: '#1a1a1a',
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },
        // Rejection info
        rejectionReason: {
            type: String,
            default: null,
        },
        // Publishing info
        publishedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug before saving
blogSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        const baseSlug = slugify(this.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        // Ensure unique slug
        while (await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        this.slug = slug;
    }
    next();
});

// Auto-generate excerpt from content if not provided
blogSchema.pre('save', function (next) {
    if (!this.excerpt && this.content) {
        // Strip HTML tags and get first 200 characters
        const plainText = this.content.replace(/<[^>]*>/g, '');
        this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    }
    next();
});

// Index for search
blogSchema.index({ title: 'text', content: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
