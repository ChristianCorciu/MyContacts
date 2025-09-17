import express from 'express';
import requireAuth from '../middleware/auth.middleware.js';
import Contact from '../models/contact.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erreur Serveur' });
    }
});

router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Le nom, l\'email et le téléphone sont requis.' });
    }

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            user: req.user.id
        });

        const contact = await newContact.save();
        res.status(201).json(contact);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: `Un contact avec le téléphone ${err.keyValue.phone} existe déjà.` });
        }
        console.error("Erreur lors de l'ajout du contact:", err);
        res.status(500).json({ message: 'Erreur lors de la création du contact.' });
    }
});

export default router;