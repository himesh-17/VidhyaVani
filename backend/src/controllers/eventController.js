import { Event } from '../models/index.js';

/**
 * @desc    Get all events (public)
 * @route   GET /api/v1/events
 * @access  Public
 */
export const getEvents = async (req, res, next) => {
    try {
        const { filter } = req.query;
        let query = {};

        const now = new Date();
        if (filter === 'upcoming') {
            query.eventDate = { $gte: now };
        } else if (filter === 'past') {
            query.eventDate = { $lt: now };
        }

        const events = await Event.find(query)
            .populate('createdBy', 'name email')
            .sort({ eventDate: filter === 'past' ? -1 : 1 });

        res.status(200).json({
            success: true,
            data: { events },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single event
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
export const getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.status(200).json({
            success: true,
            data: { event },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create event
 * @route   POST /api/v1/events
 * @access  Protected (Faculty, Admin)
 */
export const createEvent = async (req, res, next) => {
    try {
        const { title, description, venue, eventDate, coverImage } = req.body;

        const event = await Event.create({
            title,
            description,
            venue,
            eventDate,
            coverImage,
            createdBy: req.user._id,
        });

        await event.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: { event },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update event
 * @route   PUT /api/v1/events/:id
 * @access  Protected (Faculty, Admin)
 */
export const updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Only creator or admin can update
        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event',
            });
        }

        const { title, description, venue, eventDate, coverImage } = req.body;

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, venue, eventDate, coverImage },
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: { event },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/v1/events/:id
 * @access  Protected (Faculty, Admin)
 */
export const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Only creator or admin can delete
        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event',
            });
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
