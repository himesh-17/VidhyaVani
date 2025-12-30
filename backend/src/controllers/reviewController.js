import { Blog, BlogReview } from '../models/index.js';

/**
 * @desc    Get all pending review blogs
 * @route   GET /api/v1/reviews/pending
 * @access  Protected (Faculty, Admin)
 */
export const getPendingBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ status: 'PENDING_REVIEW' })
            .populate('author', 'name email avatar')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            data: { blogs },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve a blog
 * @route   POST /api/v1/reviews/:blogId/approve
 * @access  Protected (Faculty, Admin)
 */
export const approveBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        if (blog.status !== 'PENDING_REVIEW') {
            return res.status(400).json({
                success: false,
                message: `Cannot approve a blog with status: ${blog.status}`,
            });
        }

        // Update blog status
        blog.status = 'APPROVED';
        blog.publishedAt = new Date();
        blog.rejectionReason = null;
        await blog.save();

        // Create audit log
        await BlogReview.create({
            blog: blog._id,
            reviewer: req.user._id,
            action: 'APPROVED',
        });

        await blog.populate('author', 'name email avatar');

        res.status(200).json({
            success: true,
            message: 'Blog approved successfully',
            data: { blog },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reject a blog (deletes from database)
 * @route   POST /api/v1/reviews/:blogId/reject
 * @access  Protected (Faculty, Admin)
 */
export const rejectBlog = async (req, res, next) => {
    try {
        const { reason } = req.body;

        if (!reason || reason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required',
            });
        }

        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        if (blog.status !== 'PENDING_REVIEW') {
            return res.status(400).json({
                success: false,
                message: `Cannot reject a blog with status: ${blog.status}`,
            });
        }

        // Store blog info for audit before deletion
        const blogId = blog._id;
        const blogTitle = blog.title;
        const authorId = blog.author;

        // Create audit log before deletion
        await BlogReview.create({
            blog: blogId,
            reviewer: req.user._id,
            action: 'REJECTED',
            reason,
        });

        // Delete the blog from database
        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({
            success: true,
            message: 'Blog rejected and deleted',
            data: {
                deletedBlogId: blogId,
                blogTitle,
                authorId,
                reason
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get review history for a blog
 * @route   GET /api/v1/reviews/:blogId/history
 * @access  Protected (Author, Faculty, Admin)
 */
export const getReviewHistory = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Check authorization
        const isOwner = blog.author.toString() === req.user._id.toString();
        const isReviewer = ['FACULTY', 'ADMIN'].includes(req.user.role);

        if (!isOwner && !isReviewer) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view review history',
            });
        }

        const reviews = await BlogReview.find({ blog: req.params.blogId })
            .populate('reviewer', 'name email')
            .sort({ reviewedAt: -1 });

        res.status(200).json({
            success: true,
            data: { reviews },
        });
    } catch (error) {
        next(error);
    }
};
