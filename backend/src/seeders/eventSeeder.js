import Event from '../models/Event.js';
import User from '../models/User.js';

const eventImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80", // Conference
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80", // Concert
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80", // Speaker
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80", // Meeting
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80", // Lecture
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80", // Workshop
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", // Crowd
];

const eventData = [
    { title: "Annual Tech Symposium 2025", type: "Academic" },
    { title: "Saraswati Puja Cultural Fest", type: "Cultural" },
    { title: "AI & Robotics Workshop", type: "Workshop" },
    { title: "Career Guidance Seminar", type: "Seminar" },
    { title: "Inter-College Sports Meet", type: "Sports" },
    { title: "Music Under the Stars", type: "Cultural" },
    { title: "Startup Pitch Day", type: "Academic" },
    { title: "Green Campus Initiative Drive", type: "Social" },
    { title: "Photography Exhibition: Perspectives", type: "Cultural" },
    { title: "Full Stack Coding Bootcamp", type: "Workshop" }
];

const venues = [
    "Main Auditorium",
    "Conference Hall A",
    "Campus Grounds",
    "Innovation Lab",
    "Seminar Room 3",
    "Open Air Theatre",
    "Sports Complex"
];

export const seedEvents = async () => {
    try {
        console.log('Seeding events...');

        const creator = await User.findOne({ role: { $in: ['ADMIN', 'FACULTY'] } });

        if (!creator) {
            console.log('No Admin or Faculty user found. Skipping event seeding.');
            return;
        }

        await Event.deleteMany({});
        console.log('Cleared existing events.');

        const events = [];
        const today = new Date();

        // Generate 20 events
        for (let i = 0; i < 20; i++) {
            const data = eventData[i % eventData.length];
            // Even index = Upcoming, Odd index = Past
            const isUpcoming = i % 2 === 0;

            // Random date offset: 1-60 days
            const daysOffset = Math.floor(Math.random() * 60) + 1;
            const eventDate = new Date(today);

            if (isUpcoming) {
                eventDate.setDate(today.getDate() + daysOffset);
            } else {
                eventDate.setDate(today.getDate() - daysOffset);
            }

            // Random time 10AM - 4PM
            eventDate.setHours(10 + Math.floor(Math.random() * 6), 0, 0, 0);

            events.push({
                title: data.title,
                description: `Join us for the ${data.title}. This ${data.type} event promises to be an engaging experience. Whether you are looking to learn something new, network with peers, or just have fun, this is the place to be. Registration is open now!`,
                venue: venues[i % venues.length],
                eventDate: eventDate,
                coverImage: eventImages[i % eventImages.length],
                createdBy: creator._id
            });
        }

        await Event.insertMany(events);
        console.log(`Successfully seeded ${events.length} events.`);

    } catch (error) {
        console.error('Error seeding events:', error);
        throw error;
    }
};

export default seedEvents;
