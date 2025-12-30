import 'dotenv/config';

console.log('Current Working Directory:', process.cwd());
const uri = process.env.MONGODB_URI;
console.log('MONGODB_URI type:', typeof uri);
if (!uri) {
    console.log('MONGODB_URI is undefined or empty');
} else {
    console.log('MONGODB_URI length:', uri.length);
    console.log('Starts with mongodb:// or mongodb+srv:// ?', uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'));
    console.log('First 20 chars:', uri.substring(0, 20));
}
