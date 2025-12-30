import Blog from '../models/Blog.js';
import User from '../models/User.js';
import slugify from 'slugify';

// Curated high-quality unsplash images
const techImages = [
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=80", // Coding screen
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80", // AI Chip
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80", // Cybersecurity
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80", // Matrix code
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80", // Coding setup
    "https://images.unsplash.com/photo-1531297461136-82072713946f?w=1200&q=80", // Hardware
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80", // Network
];

const lifestyleImages = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80", // Studying
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80", // Group study
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80", // Books
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80", // Tablet writing
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80", // Exam prep
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80", // College friends
];

const blogData = [
    {
        title: "The Rise of Generative AI in Education",
        category: "Tech",
        content: `
            <p>Generative AI is reshaping how we learn and teach. Tools like ChatGPT and Midjourney are not just novelties; they are becoming integral parts of the educational landscape.</p>
            <h2>Personalized Learning</h2>
            <p>Imagine a tutor that is available 24/7, capable of adapting to your specific learning style. This is the promise of AI in education.</p>
            <blockquote>"AI won't replace teachers, but teachers who use AI will replace those who don't."</blockquote>
            <p>However, we must also navigate the ethical challenges, such as plagiarism and data privacy.</p>
        `
    },
    {
        title: "Mastering Time Management for Finals",
        category: "Lifestyle",
        content: `
            <p>Finals week can be stressful, but with the right strategies, you can conquer it. It's all about planning and prioritization.</p>
            <ul>
                <li>Create a study schedule and stick to it.</li>
                <li>Use the Pomodoro technique to avoid burnout.</li>
                <li>Get enough sleep - your brain needs it to consolidate memories.</li>
            </ul>
            <p>Remember, breaks are just as important as study sessions.</p>
        `
    },
    {
        title: "Web Development Trends to Watch in 2025",
        category: "Tech",
        content: `
            <p>The web is constantly evolving. From the dominance of React Server Components to the rise of edge computing, staying updated is key for any developer.</p>
            <h2>Performance First</h2>
            <p>User experience is heavily tied to performance. Core Web Vitals are now a critical ranking factor.</p>
            <p>We are also seeing a shift towards more diverse frameworks like Svelte and SolidJS challenging the status quo.</p>
        `
    },
    {
        title: "The Importance of Networking in College",
        category: "Lifestyle",
        content: `
            <p>Your degree gets you to the door, but your network opens it. College is the best time to build professional relationships.</p>
            <p>Attend seminars, join clubs, and don't be afraid to reach out to alumni. These connections can lead to internships and job offers down the line.</p>
        `
    },
    {
        title: "Cybersecurity: Protecting Your Digital Identity",
        category: "Tech",
        content: `
            <p>In an era of increasing data breaches, securing your digital footprint is paramount. It starts with simple habits.</p>
            <ul>
                <li>Use strong, unique passwords for every account.</li>
                <li>Enable Two-Factor Authentication (2FA) wherever possible.</li>
                <li>Be wary of phishing emails and suspicious links.</li>
            </ul>
        `
    },
    {
        title: "Mental Health Awareness on Campus",
        category: "Lifestyle",
        content: `
            <p>University life is rewarding but demanding. It's crucial to acknowledge the pressure and normalize conversations about mental health.</p>
            <p>If you're feeling overwhelmed, reach out to campus counseling services. You are not alone.</p>
        `
    },
    {
        title: "The Future of Remote Work",
        category: "Tech",
        content: `
            <p>Remote work is here to stay. But what does the future look like? Hybrid models seem to be the sweet spot for many organizations.</p>
            <p>Tools for asynchronous collaboration are becoming more sophisticated, allowing teams to work effectively across time zones.</p>
        `
    },
    {
        title: "Sustainable Living for Students",
        category: "Lifestyle",
        content: `
            <p>Living on a budget doesn't mean you can't be eco-friendly. Small changes make a big difference.</p>
            <p>Carry a reusable water bottle, use digital notes instead of paper, and be mindful of energy consumption in your dorm.</p>
        `
    },
    {
        title: "Introduction to Blockchain Technology",
        category: "Tech",
        content: `
            <p>Blockchain is more than just Bitcoin. It's a decentralized ledger technology with applications in finance, supply chain, and voting systems.</p>
            <p>Understanding the basics of smart contracts and decentralized apps (dApps) is becoming a valuable skill.</p>
        `
    },
    {
        title: "How to Build a Standout Portfolio",
        category: "Lifestyle",
        content: `
            <p>Whether you're a designer, developer, or writer, a strong portfolio is your best asset.</p>
            <p>Focus on quality over quantity. Show your process, not just the final result. Explain the 'why' behind your decisions.</p>
        `
    }
];

// Helper to get random image based on category
const getImage = (category) => {
    const set = category === 'Tech' ? techImages : lifestyleImages;
    return set[Math.floor(Math.random() * set.length)];
};

export const seedBlogs = async () => {
    try {
        console.log('Seeding blogs...');

        // Find a student user to be the author
        const author = await User.findOne({ role: 'STUDENT' });

        if (!author) {
            console.log('No student user found. Skipping blog seeding.');
            return;
        }

        // Clear existing blogs
        await Blog.deleteMany({});
        console.log('Cleared existing blogs.');

        const blogs = [];

        // Generate 20 blogs (looping through our data set twice)
        for (let i = 0; i < 20; i++) {
            const data = blogData[i % blogData.length];
            const title = i >= blogData.length ? `${data.title} (Part 2)` : data.title;

            blogs.push({
                title,
                content: data.content,
                excerpt: `Read more about ${title}. A deep dive into the topic providing insights and valuable information for students and professionals.`,
                coverImage: getImage(data.category),
                author: author._id,
                status: 'APPROVED',
                publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in last 30 days
                slug: slugify(title, { lower: true, strict: true }) + (i >= blogData.length ? `-${i}` : ''),
                fontFamily: 'Inter',
                fontSize: 16,
                fontColor: '#1a1a1a',
                theme: 'light'
            });
        }

        await Blog.insertMany(blogs);
        console.log(`Successfully seeded ${blogs.length} blogs.`);

    } catch (error) {
        console.error('Error seeding blogs:', error);
        throw error;
    }
};

export default seedBlogs;
