import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import authenticate from "./middleware/authenticate.js";
import nodemailer from 'nodemailer';


dotenv.config();

// Import des modèles
import Recruiter from './models/Recruiter.js';
import Candidate from './models/Candidate.js';
import Consultant from './models/Consultant.js';
import Administrator from './models/Administrator.js';
import Job from './models/Job.js';
import Postulation from './models/Postulation.js';

import './models/initModels.js';

// Ajout des hooks pour le hachage des mots de passe
const addHashingHooks = (model) => {
  model.addHook('beforeCreate', async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
  
  model.addHook('beforeUpdate', async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
};
  


addHashingHooks(Candidate);
addHashingHooks(Recruiter);
addHashingHooks(Consultant);
addHashingHooks(Administrator);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


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

app.get('/api/pending-jobs', authenticate, async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des jobs.' });
  }
});


app.put('/api/approve-job', authenticate, async (req, res) => {
  const { id, isApproved } = req.body;
  try {
    await Job.update({ isApproved }, { where: { id } });
    res.json({ message: 'Statut du job mis à jour avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut du job.' });
  }
});

app.get('/api/approved-jobs', authenticate, async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { isApproved: true } });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des jobs validés.' });
  }
});


app.get('/api/jobs/byRecruiter/:recruiterId', async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;
    const jobs = await Job.findAll({
      where: { id_recruiter: recruiterId },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des jobs.' });
  }
});

app.get('/api/postulations/byJob/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const postulations = await Postulation.findAll({
      where: { id_job: jobId },
      include: [
        { model: Candidate, as: 'candidate', attributes: ['name'] },
        { model: Job, as: 'job', attributes: ['title'] }
      ]
    });
    res.json(postulations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des postulations.' });
  }
});



app.post('/api/postulations', authenticate, async (req, res) => {
  const { id_candidate, id_job } = req.body;
  try {
    const newPostulation = await Postulation.create({ id_candidate, id_job });
    res.status(200).json(newPostulation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la postulation.' });
  }
});

app.get('/api/pending-postulations', authenticate, async (req, res) => {
  try {
    const postulations = await Postulation.findAll({
      where: { isApproved: false },
      include: [
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['name']
        },
        {
          model: Job,
          as: 'job', 
          attributes: ['title']
        }
      ]
    });
    res.json(postulations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des postulations en attente.' });
  }
});


app.put('/api/approve-postulation', authenticate, async (req, res) => {
  const { id, isApproved } = req.body;
  try {
    await Postulation.update({ isApproved }, { where: { id } });

    // Récupérer des informations supplémentaires pour l'e-mail
    const postulation = await Postulation.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: Recruiter,
              as: 'recruiter'
            }
          ]
        },
        {
          model: Candidate,
          as: 'candidate'
        }
      ]
    });

    const postulations = await Postulation.findAll({
      where: { id_job: jobId },
      include: [
        Candidate, 
        {
          model: Job,
          attributes: ['title'] 
        }
      ]
    });
    
    
    

    // Déclaration des variables
    const recruiterEmail = postulation.job.recruiter.email;
    const candidateName = `${postulation.candidate.firstName} ${postulation.candidate.lastName}`;
    const candidateCV = postulation.candidate.cvPath;

    // Logs pour le diagnostic
    console.log("Recruiter Email:", recruiterEmail);
    console.log("Candidate Name:", candidateName);
    console.log("Candidate CV:", candidateCV);

    // Préparation de l'e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recruiterEmail,
      subject: 'Postulation approuvée',
      text: `La postulation de ${candidateName} a été approuvée.`,
      attachments: [
        {
          path: candidateCV
        }
      ]
    };

    // Envoi de l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: 'Postulation mise à jour avec succès.' });
  } catch (error) {
    console.log("Erreur détaillée:", error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la postulation.' });
  }
});





// Fonction asynchrone pour créer les tables dans un ordre spécifique
const createTables = async () => {
  try {
    await Recruiter.sync({ alter: true  });
    await Candidate.sync({ alter: true  });
    await Consultant.sync({ alter: true });
    await Administrator.sync({ alter: true});
    await Job.sync({ alter: true });
    

    // Créer cette table en dernier à cause de ses dépendances avec les autres
    await Postulation.sync({ alter: true });
    console.log('Table Postulation créée');
  } catch (error) {
    console.log(`Erreur lors de la création des tables : ${error}`);
  }
};

// Appel de la fonction pour créer les tables
createTables();


export default app;