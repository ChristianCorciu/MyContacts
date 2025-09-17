import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './apps.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    app.listen(PORT, () => console.log(`Server fonctionne sur le port ${PORT}`));
  })
  .catch(err => {
    console.error('Erreur de connexion :', err);
    process.exit(1);
  });
