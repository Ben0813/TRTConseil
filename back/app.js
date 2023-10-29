import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

dotenv.config();

// Import des modèles
import Recruiter from './models/Recruiter.js';
import Candidate from './models/Candidate.js';
import Consultant from './models/Consultant.js';
import Administrator from './models/Administrator.js';
import Job from './models/Job.js';
import Postulation from './models/Postulation.js';

// Ajout des hooks pour le hachage des mots de passe
const addHashingHooks = (model) => {
  model.addHook('beforeCreate', async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
  
  model.addHook('beforeUpdate', async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
};

addHashingHooks(Candidate);
addHashingHooks(Recruiter);
addHashingHooks(Consultant);
addHashingHooks(Administrator);

// Import des routes
import recruiterRoutes from './routes/recruiters.js';
import candidateRoutes from './routes/candidates.js';
import consultantRoutes from './routes/consultants.js';
import administratorRoutes from './routes/administrators.js';
import jobRoutes from './routes/jobs.js';
import postulationRoutes from './routes/postulations.js';

const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Utilisation des routes
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/consultants', consultantRoutes);
app.use('/api/administrators', administratorRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/postulations', postulationRoutes);

app.get('/api/pending-accounts', authenticate, async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const recruiters = await Recruiter.findAll();

    const pendingAccounts = [
      ...candidates.map(c => ({ id: c.id, email: c.email, type: 'candidate', isApproved: c.isApproved })),
      ...recruiters.map(r => ({ id: r.id, email: r.email, type: 'recruiter', isApproved: r.isApproved }))
    ];
    

    res.json(pendingAccounts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des comptes en attente.' });
  }
});

app.put('/api/approve-account', authenticate, async (req, res) => {
  const { id, type, isApproved } = req.body;
  try {
    if (type === 'candidate') {
      await Candidate.update({ isApproved }, { where: { id } });
    } else if (type === 'recruiter') {
      await Recruiter.update({ isApproved }, { where: { id } });
    } else {
      return res.status(400).json({ error: 'Type de compte inconnu.' });
    }
    res.json({ message: 'Statut du compte mis à jour avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut du compte.' });
  }
});


app.post('/api/reject-account', authenticate, async (req, res) => {
  const { id, type } = req.body;
  try {
    if (type === 'candidate') {
      await Candidate.destroy({ where: { id } });
    } else if (type === 'recruiter') {
      await Recruiter.destroy({ where: { id } });
    } else {
      return res.status(400).json({ error: 'Type de compte inconnu.' });
    }
    res.json({ message: 'Compte rejeté avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du rejet du compte.' });
  }
});


// Fonction asynchrone pour créer les tables dans un ordre spécifique
const createTables = async () => {
  try {
    await Recruiter.sync({ alter: false  });
    await Candidate.sync({ alter: false  });
    await Consultant.sync({ alter: false });
    await Administrator.sync({ alter: false});
    await Job.sync({ alter: false });

    // Créer cette table en dernier à cause de ses dépendances avec les autres
    await Postulation.sync({ alter: false });
    console.log('Table Postulation créée');
  } catch (error) {
    console.log(`Erreur lors de la création des tables : ${error}`);
  }
};

// Appel de la fonction pour créer les tables
createTables();


export default app;