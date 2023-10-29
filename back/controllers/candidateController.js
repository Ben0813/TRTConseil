import Candidate from "../models/Candidate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

export const upload = multer({ storage: storage });

export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCandidate = async (req, res) => {
  console.log('Entrée dans createCandidate'); 
  console.log('Données reçues:', req.body); 
  
  const { name, firstname, email, password } = req.body;
  if (!name || !firstname || !email || !password ) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const candidate = await Candidate.create({
      ...req.body,
      isApproved: false 
    });
    res.status(201).json({ id: candidate.id });
  } catch (err) {
    console.log('Erreur:', err); 
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }
    res.status(500).json({ message: 'Une erreur interne s\'est produite.' });
  }
};


export const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (candidate) {
      await candidate.update(req.body);
      res.status(200).json({ id: candidate.id });
    } else {
      res.status(404).json({ message: "Candidate not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadCV = async (req, res) => {
  const { id } = req.user; 
  const cvPath = req.file.path;

  try {
    await Candidate.update({ cvPath }, { where: { id } });
    res.status(200).json({ message: 'CV uploadé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’upload du CV.' });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (candidate) {
      await candidate.destroy();
      res.status(200).json({ id: candidate.id });
    } else {
      res.status(404).json({ message: "Candidate not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await Candidate.findOne({ where: { email } });

    if (!candidate || !(await bcrypt.compare(password, candidate.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!candidate.isApproved) {
      return res.status(401).json({ message: "Your account has not been approved yet" });
    }

    const passwordValid = await bcrypt.compare(password, candidate.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: candidate.id, email: candidate.email, userType: "candidate" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, userType: "candidate" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const candidateController = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  loginCandidate,
  uploadCV
};



export default candidateController;
