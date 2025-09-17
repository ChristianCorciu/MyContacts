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

/**
 * @route   DELETE /contacts/:id
 * @desc    Supprimer un contact
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact non trouvé.' });
        }

        // Vérifier que l'utilisateur possède bien le contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Action non autorisée.' });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.json({ message: 'Contact supprimé avec succès.' });

    } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        res.status(500).json({ message: 'Erreur Serveur' });
    }
});
/**
 * @route   PUT /contacts/:id
 * @desc    Mettre à jour un contact
 * @access  Private
 */
router.put('/:id', async (req, res) => {
    const { name, email, phone } = req.body;

    // Construire l'objet de mise à jour
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact non trouvé.' });
        }

        // Vérifier que l'utilisateur possède bien le contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Action non autorisée.' });
        }

        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: contactFields },
            { new: true } // Pour renvoyer le document mis à jour
        );
 res.json(contact);

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: `Un contact avec le téléphone ${phone} existe déjà.` });
        }
        console.error("Erreur lors de la mise à jour:", err);
        res.status(500).json({ message: 'Erreur Serveur' });
    }
});


export default router;