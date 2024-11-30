import { prisma } from '../../lib/prisma';

export default async function handler(req, res)
{
    if(req.method === 'POST')
    {
        const { name, email } = req.body;

        // Validate name (no special characters, only letters and spaces, 3-50 characters)
        const nameRegex = /^[a-zA-Z\s]{3,50}$/;
        if(!name || !nameRegex.test(name))
        {
            return res.status(400).json({ error: 'Invalid name. Only letters and spaces are allowed, with a length of 3 to 50 characters.' });
        }

        // Validate email (basic email format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email))
        {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if(existingUser)
        {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }

        // Create a new user
        const user = await prisma.user.create({
            data: { name, email },
        });

        return res.status(201).json({ user });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
