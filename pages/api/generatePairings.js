import { prisma } from '../../lib/prisma';
import { sendPairingEmail } from '../../lib/email';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { customMessage, language } = req.body; // Extract customMessage from the request
        // Get all users
        const users = await prisma.user.findMany();

        // Randomly shuffle users
        const shuffledUsers = [...users].sort(() => 0.5 - Math.random());

        // Assign pairings
        for (let i = 0; i < users.length; i++) {
            const pairingIndex = (i + 1) % users.length; // Last user pairs with first user
            await prisma.user.update({
                where: { id: users[i].id },
                data: { pairingId: shuffledUsers[pairingIndex].id }
            });

            // Send emails with the entire paired user object
            await sendPairingEmail(users[i].email, shuffledUsers[pairingIndex], language, customMessage);
        }

        res.status(200).json({ message: 'Pairings generated and emails sent.' });
    } else {
        res.status(405).end();
    }
}
