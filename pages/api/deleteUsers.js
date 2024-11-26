// pages/api/deleteUsers.js
import {prisma} from '../../lib/prisma'; // Ensure this points to your Prisma client

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Check if there are any users in the database
            const userCount = await prisma.user.count();

            if (userCount === 0) {
                return res.status(200).json({ message: 'No users found in the database.' });
            }

            // Delete all users if there are any
            await prisma.user.deleteMany();

            res.status(200).json({ message: 'All users deleted successfully!' });
        } catch (error) {
            console.error('Error deleting users:', error);
            res.status(500).json({ message: 'An error occurred while deleting users.' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
