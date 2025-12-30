import * as authService from '../services/authService.js';
import { cookieOptions } from '../config/jwt.js';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const { user, accessToken, refreshToken } = await authService.registerUser({
            name,
            email,
            password,
            role,
        });

        // Set cookies
        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, accessToken, refreshToken } = await authService.loginUser(
            email,
            password
        );

        // Set cookies
        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res, next) => {
    try {
        const token = req.body.refreshToken || req.cookies?.refreshToken;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        const user = await authService.verifyRefreshToken(token);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
        }

        // Rotate tokens
        const newAccessToken = authService.generateAccessToken(user._id);
        const newRefreshToken = await authService.rotateRefreshToken(token, user._id);

        // Set cookies
        res.cookie('accessToken', newAccessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Protected
 */
export const logout = async (req, res, next) => {
    try {
        const token = req.body.refreshToken || req.cookies?.refreshToken;

        if (token) {
            await authService.invalidateRefreshToken(token);
        }

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Protected
 */
export const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout from all devices
 * @route   POST /api/v1/auth/logout-all
 * @access  Protected
 */
export const logoutAll = async (req, res, next) => {
    try {
        await authService.invalidateAllUserTokens(req.user._id);

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out from all devices successfully',
        });
    } catch (error) {
        next(error);
    }
};
