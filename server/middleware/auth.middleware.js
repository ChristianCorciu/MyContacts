import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Token autorisation requis' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; 
        
        next();
    } catch (error) {
        console.error("Erreur de vérification du token:", error.message);
        res.status(403).json({ message: 'Token invalide ou expiré' });
    }
};

export default requireAuth;