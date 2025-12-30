import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { User, RefreshToken } from '../models/index.js';

/**
 * Generate Access Token
 */
export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, jwtConfig.accessSecret, {
        expiresIn: jwtConfig.accessExpiresIn,
    });
};

/**
 * Generate Refresh Token and store in database
 */
export const generateRefreshToken = async (userId) => {
    const token = jwt.sign({ userId }, jwtConfig.refreshSecret, {
        expiresIn: jwtConfig.refreshExpiresIn,
    });

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Store in database
    await RefreshToken.create({
        token,
        user: userId,
        expiresAt,
    });

    return token;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, jwtConfig.refreshSecret);
        const storedToken = await RefreshToken.findValidToken(token);

        if (!storedToken) {
            return null;
        }

        return storedToken.user;
    } catch (error) {
        return null;
    }
};

/**
 * Rotate Refresh Token (invalidate old, create new)
 */
export const rotateRefreshToken = async (oldToken, userId) => {
    // Delete old token
    await RefreshToken.deleteOne({ token: oldToken });

    // Generate new token
    return generateRefreshToken(userId);
};

/**
 * Invalidate all refresh tokens for a user (logout from all devices)
 */
export const invalidateAllUserTokens = async (userId) => {
    await RefreshToken.deleteMany({ user: userId });
};

/**
 * Invalidate specific refresh token
 */
export const invalidateRefreshToken = async (token) => {
    await RefreshToken.deleteOne({ token });
};

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        throw error;
    }

    // Create user (password hashing handled by model)
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'STUDENT',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    return { user, accessToken, refreshToken };
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
    console.time('Login: Find user');
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    console.timeEnd('Login: Find user');

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    console.time('Login: Compare password');
    // Compare password
    const isMatch = await user.comparePassword(password);
    console.timeEnd('Login: Compare password');

    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    console.time('Login: Generate tokens');
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    console.timeEnd('Login: Generate tokens');

    // Remove password from response
    user.password = undefined;

    return { user, accessToken, refreshToken };
};
