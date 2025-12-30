import { User, Blog } from '../models/index.js';

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Protected (Admin)
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const { role, search } = req.query;
        let query = {};

        if (role) {
            query.role = role.toUpperCase();
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { users },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 * @access  Protected (Admin)
 */
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Get user's blog stats
        const blogStats = await Blog.aggregate([
            { $match: { author: user._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                user,
                blogStats: blogStats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Change user role
 * @route   PUT /api/v1/users/:id/role
 * @access  Protected (Admin)
 */
export const changeUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['STUDENT', 'FACULTY', 'ADMIN'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be STUDENT, FACULTY, or ADMIN',
            });
        }

        // Prevent changing own role
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot change your own role',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Protected (Admin)
 */
export const deleteUser = async (req, res, next) => {
    try {
        // Prevent self-deletion
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Override blog status (Admin)
 * @route   PUT /api/v1/users/blogs/:id/status
 * @access  Protected (Admin)
 */
export const overrideBlogStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
            });
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                status,
                publishedAt: status === 'APPROVED' ? new Date() : null,
            },
            { new: true }
        ).populate('author', 'name email avatar');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.status(200).json({
            success: true,
            message: `Blog status updated to ${status}`,
            data: { blog },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all blogs (Admin)
 * @route   GET /api/v1/users/blogs
 * @access  Protected (Admin)
 */
export const getAllBlogs = async (req, res, next) => {
    try {
        const { status, author } = req.query;
        let query = {};

        if (status) {
            query.status = status.toUpperCase();
        }

        if (author) {
            query.author = author;
        }

        const blogs = await Blog.find(query)
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
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Protected
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, avatar },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get dashboard stats
 * @route   GET /api/v1/users/stats
 * @access  Protected (Admin)
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const [userStats, blogStats] = await Promise.all([
            User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 },
                    },
                },
            ]),
            Blog.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                users: userStats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                blogs: blogStats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        next(error);
    }
};
