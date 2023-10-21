import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

// Importation des modèles
import Recruiter from './models/Recruiter.js';
import Candidate from './models/Candidate.js';
import Consultant from './models/Consultant.js';
import Administrator from './models/Administrator.js';
import Job from './models/Job.js';
import Postulation from './models/Postulation.js';

// Importation des routes
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

// Utilisation des routes
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/consultants', consultantRoutes);
app.use('/api/administrators', administratorRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/postulations', postulationRoutes);

// Fonction asynchrone pour créer les tables dans un ordre spécifique
const createTables = async () => {
  try {
    await Recruiter.sync({ alter: false });
    console.log('Table Recruiter créée');
    await Candidate.sync({ alter: false });
    console.log('Table Candidate créée');
    await Consultant.sync({ alter: false });
    console.log('Table Consultant créée');
    await Administrator.sync({ alter: false });
    console.log('Table Administrator créée');
    await Job.sync({ alter: false });
    console.log('Table Job créée');

    // Créer cette table en dernier à cause de ses dépendances avec les autres
    await Postulation.sync({ alter: false });
    console.log('Table Postulation créée');
  } catch (error) {
    console.log(`Erreur lors de la création des tables : ${error}`);
  }
};

// Appel de la fonction pour créer les tables
createTables();

// Démarrage du serveur
app.listen(3001, () => {
  console.log('Serveur en cours d\'exécution sur le port 3001');
});

export default app;