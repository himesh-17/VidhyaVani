import User from '../models/User.js';

const testUsers = [
    {
        name: 'Admin User',
        email: 'admin@institution.edu',
        password: 'admin123456',
        role: 'ADMIN',
    },
    {
        name: 'Faculty Member',
        email: 'faculty@institution.edu',
        password: 'faculty123456',
        role: 'FACULTY',
    },
    {
        name: 'Student User',
        email: 'student@institution.edu',
        password: 'student123456',
        role: 'STUDENT',
    },
];

export const seedTestUsers = async () => {
    try {
        console.log('Seeding test users...');

        for (const userData of testUsers) {
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                // Update existing user's password and role
                existingUser.password = userData.password;
                existingUser.role = userData.role;
                existingUser.name = userData.name;
                await existingUser.save();
                console.log(`Updated existing user: ${userData.email} (${userData.role})`);
            } else {
                await User.create(userData);
                console.log(`Created new user: ${userData.email} (${userData.role})`);
            }
        }

        console.log('\n=== TEST CREDENTIALS ===');
        console.log('Admin:   admin@institution.edu / admin123456');
        console.log('Faculty: faculty@institution.edu / faculty123456');
        console.log('Student: student@institution.edu / student123456');
        console.log('========================\n');

    } catch (error) {
        console.error('Error seeding test users:', error.message);
        throw error;
    }
};

export default seedTestUsers;
