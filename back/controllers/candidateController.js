import Candidate from "../models/Candidate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { body, param, validationResult } from "express-validator";

// Creates a storage configuration object for handling file uploads using the multer library
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

export const upload = multer({ storage: storage });

// Retrieves all candidates from the database
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieves a candidate with the specified ID from the database
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a new candidate in the database
export const createCandidate = [
  body("name").trim().notEmpty().withMessage("Le nom est requis."),
  body("firstname").trim().notEmpty().withMessage("Le prénom est requis."),
  body("email")
    .isEmail()
    .withMessage("L'email doit être une adresse email valide."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const candidate = await Candidate.create({
        ...req.body,
        isApproved: false,
      });
      res.status(201).json({ id: candidate.id });
    } catch (err) {
      res.status(500).json({ message: "Une erreur interne s'est produite." });
    }
  },
];

// Updates an existing candidate in the database
export const updateCandidate = [
  param("id").isUUID().withMessage("L'ID doit être un UUID valide"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { name, firstname } = req.body;
      const cv = req.file;

      const candidate = await Candidate.findByPk(id);

      if (!candidate) {
        return res.status(404).json({ message: "Candidat non trouvé" });
      }

      if (name) candidate.name = name;
      if (firstname) candidate.firstname = firstname;
      if (cv) candidate.cvPath = cv.path;

      await candidate.save();
      res
        .status(200)
        .json({ message: "Profil mis à jour avec succès", candidate });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du profil" });
    }
  },
];

// Uploads a CV to the server
export const uploadCV = async (req, res) => {
  const { id } = req.user;
  const cvPath = req.file.path;

  try {
    await Candidate.update({ cvPath }, { where: { id } });
    res.status(200).json({ message: "CV uploadé avec succès." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l’upload du CV." });
  }
};

// Deletes a candidate from the database
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

// Logs in a candidate
export const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await Candidate.findOne({ where: { email } });

    if (!candidate || !(await bcrypt.compare(password, candidate.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!candidate.isApproved) {
      return res
        .status(401)
        .json({ message: "Your account has not been approved yet" });
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

    res.status(200).json({ token, userType: "candidate", id: candidate.id });
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
  uploadCV,
};

export default candidateController;
