import 'dotenv/config';
import connectDB from './config/database.js';
import seedAdmin from './seeders/adminSeeder.js';
import seedBlogs from './seeders/blogSeeder.js';
import seedEvents from './seeders/eventSeeder.js';

const runSeeder = async () => {
    try {
        await connectDB();
        await seedAdmin();
        await seedBlogs();
        await seedEvents();
        console.log('Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

runSeeder();
