// routes/contacts.js
import express from "express";
import Contact from "../models/contact.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestion des contacts
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Créer un nouveau contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - telephone
 *             properties:
 *               prenom:
 *                 type: string
 *                 example: Jean
 *               nom:
 *                 type: string
 *                 example: Dupont
 *               telephone:
 *                 type: string
 *                 example: "+33612345678"
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { prenom, nom, telephone } = req.body;
    const contact = new Contact({ prenom, nom, telephone });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Erreur lors de la création du contact" });
  }
});

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupérer tous les contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des contacts" });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Récupérer un contact par son ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact
 *     responses:
 *       200:
 *         description: Contact trouvé
 *       404:
 *         description: Contact non trouvé
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du contact" });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Mettre à jour un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact mis à jour
 *       404:
 *         description: Contact non trouvé
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du contact" });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprimer un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact
 *     responses:
 *       200:
 *         description: Contact supprimé
 *       404:
 *         description: Contact non trouvé
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json({ message: "Contact supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du contact" });
  }
});

export default router;