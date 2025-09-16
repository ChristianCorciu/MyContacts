import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './server/routes/auth.js';
import requireAuth from './server/middleware/auth.middleware.js';
import errorHandler from "./server/middleware/error.middleware.js";
import { setupSwagger } from "./server/config/swagger.js";
import contactsRoutes from "./server/routes/contact.js";




dotenv.config();


const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

app.use("/contacts", contactsRoutes);

setupSwagger(app);
app.use(errorHandler);


app.get('/protected', requireAuth, (req, res) =>
     {
    res.json({ message: 'Accès autorisé', user: req.user });
});


const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_URI, {

})
        .then(() => {
        console.log('Connecté à MongoDB');
        app.listen(PORT, () => console.log(` Server fonctionne correctement sur le port ${PORT}`));
        })
        .catch(err => {
        console.error(' Erreur de connexion :', err);
        process.exit(1);
});