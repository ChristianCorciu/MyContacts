import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';

const SALT_ROUNDS = 10;
dotenv.config();    
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;   
    if (!email || !password || !name) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }
    try {       
  
if (!email || !password) return res.status(400).json({ error: 'Email et password requis.' });


const existing = await User.findOne({ email });
if (existing) return res.status(409).json({ error: 'Utilisateur déjà existant.' });


const hash = await bcrypt.hash(password, SALT_ROUNDS);


const user = new User({ email, password: hash });
await user.save();



return res.status(201).json({ id: user._id, email: user.email, createdAt: user.createdAt });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Erreur serveur.' });
}
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body; 
    if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    try {
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
    }
});
export default router;
    