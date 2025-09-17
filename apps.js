import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './server/routes/auth.js';
import requireAuth from './server/middleware/auth.middleware.js';
import errorHandler from "./server/middleware/error.middleware.js";
import { setupSwagger } from "./server/config/swagger.js";
import contactsRoutes from "./server/routes/contact.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/contacts', contactsRoutes);

setupSwagger(app);
app.use(errorHandler);

app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'Accès autorisé', user: req.user });
});

export default app;
