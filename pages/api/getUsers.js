import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const users = await prisma.user.findMany(); // Get all users from the database
        res.status(200).json({ users });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
