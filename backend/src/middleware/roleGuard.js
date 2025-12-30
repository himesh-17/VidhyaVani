/**
 * Role Guard Middleware Factory
 * Creates middleware that restricts access to specified roles
 * @param  {...string} allowedRoles - Roles that are allowed access
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
            });
        }

        next();
    };
};

// Pre-configured role guards for convenience
export const isStudent = authorize('STUDENT', 'FACULTY', 'ADMIN');
export const isFaculty = authorize('FACULTY', 'ADMIN');
export const isAdmin = authorize('ADMIN');
