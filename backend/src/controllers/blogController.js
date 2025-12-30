import { Blog, BlogReview } from '../models/index.js';

/**
 * @desc    Create a new blog
 * @route   POST /api/v1/blogs
 * @access  Protected (Any authenticated user)
 */
export const createBlog = async (req, res, next) => {
    try {
        const {
            title,
            content,
            excerpt,
            coverImage,
            fontFamily,
            fontSize,
            fontColor,
            theme,
        } = req.body;

        const blog = await Blog.create({
            title,
            content,
            excerpt,
            coverImage,
            fontFamily,
            fontSize,
            fontColor,
            theme,
            author: req.user._id,
            status: 'DRAFT',
        });

        await blog.populate('author', 'name email avatar');

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: { blog },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all approved blogs (public)
 * @route   GET /api/v1/blogs
 * @access  Public
 */
export const getPublicBlogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({ status: 'APPROVED' })
            .populate('author', 'name email avatar')
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments({ status: 'APPROVED' });

        res.status(200).json({
            success: true,
            data: {
                blogs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single blog by slug (public)
 * @route   GET /api/v1/blogs/:slug
 * @access  Public
 */
export const getBlogBySlug = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
            status: 'APPROVED',
        }).populate('author', 'name email avatar');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.status(200).json({
            success: true,
            data: { blog },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user's blogs
 * @route   GET /api/v1/blogs/my-blogs
 * @access  Protected
 */
export const getMyBlogs = async (req, res, next) => {
    try {
        const status = req.query.status;
        const query = { author: req.user._id };

        if (status) {
            query.status = status.toUpperCase();
        }

        const blogs = await Blog.find(query)
            .sort({ updatedAt: -1 })
            .populate('author', 'name email avatar');

        res.status(200).json({
            success: true,
            data: { blogs },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update blog
 * @route   PUT /api/v1/blogs/:id
 * @access  Protected (Author only)
 */
export const updateBlog = async (req, res, next) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Check ownership (unless admin)
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog',
            });
        }

        // Don't allow editing approved blogs (except by admin)
        if (blog.status === 'APPROVED' && req.user.role !== 'ADMIN') {
            return res.status(400).json({
                success: false,
                message: 'Cannot edit an approved blog. Contact admin for changes.',
            });
        }

        const {
            title,
            content,
            excerpt,
            coverImage,
            fontFamily,
            fontSize,
            fontColor,
            theme,
        } = req.body;

        blog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                excerpt,
                coverImage,
                fontFamily,
                fontSize,
                fontColor,
                theme,
                // Reset to draft if was rejected
                status: blog.status === 'REJECTED' ? 'DRAFT' : blog.status,
                rejectionReason: blog.status === 'REJECTED' ? null : blog.rejectionReason,
            },
            { new: true, runValidators: true }
        ).populate('author', 'name email avatar');

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: { blog },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete blog
 * @route   DELETE /api/v1/blogs/:id
 * @access  Protected (Author or Admin)
 */
export const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Check ownership (unless admin)
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog',
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Submit blog for review
 * @route   POST /api/v1/blogs/:id/submit
 * @access  Protected (Author only)
 */
export const submitForReview = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Check ownership
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to submit this blog',
            });
        }

        // Can only submit drafts or rejected blogs
        if (!['DRAFT', 'REJECTED'].includes(blog.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot submit a blog with status: ${blog.status}`,
            });
        }

        blog.status = 'PENDING_REVIEW';
        blog.rejectionReason = null;
        await blog.save();

        await blog.populate('author', 'name email avatar');

        res.status(200).json({
            success: true,
            message: 'Blog submitted for review',
            data: { blog },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get blog by ID (for editing/preview)
 * @route   GET /api/v1/blogs/edit/:id
 * @access  Protected (Author or Admin)
 */
export const getBlogById = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email avatar');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Check ownership (unless admin or faculty reviewing)
        const isOwner = blog.author._id.toString() === req.user._id.toString();
        const isReviewer = ['FACULTY', 'ADMIN'].includes(req.user.role);

        if (!isOwner && !isReviewer) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this blog',
            });
        }

        res.status(200).json({
            success: true,
            data: { blog },
        });
    } catch (error) {
        next(error);
    }
};
