// pages/api/getUserCount.js
import { prisma } from '../../lib/prisma';

export default async function handler(req, res)
{
    if(req.method === 'GET')
    {
        try
        {
            const count = await prisma.user.count(); // Get the count of users in the database
            res.status(200).json({ count });
        }
        catch (error)
        {
            console.error('Error fetching user count:', error);
            res.status(500).json({ message: 'Error fetching user count' });
        }
    }
    else
    {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
