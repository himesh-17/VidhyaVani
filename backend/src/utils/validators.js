import { body } from 'express-validator';

export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['STUDENT', 'FACULTY', 'ADMIN'])
        .withMessage('Invalid role'),
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const blogValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('fontFamily').optional().isString(),
    body('fontSize').optional().isInt({ min: 12, max: 24 }),
    body('fontColor').optional().isString(),
    body('theme').optional().isIn(['light', 'dark']),
];

export const eventValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Event title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('eventDate')
        .notEmpty()
        .withMessage('Event date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
];

export const rejectValidation = [
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('Rejection reason is required'),
];

export const roleChangeValidation = [
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['STUDENT', 'FACULTY', 'ADMIN'])
        .withMessage('Invalid role'),
];

export const statusOverrideValidation = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'])
        .withMessage('Invalid status'),
];
