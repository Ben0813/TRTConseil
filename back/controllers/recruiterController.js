import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, param, validationResult } from "express-validator";

// Retrieves all recruiters from the database
export const getRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.findAll();
    res.status(200).json(recruiters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieves a recruiter with the specified ID from the database
export const getRecruiterById = async (req, res) => {
  try {
    const recruiter = await Recruiter.findByPk(req.params.id);
    res.status(200).json(recruiter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a new recruiter in the database
export const createRecruiter = [
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
      const recruiter = await Recruiter.create({
        ...req.body,
        isApproved: false,
      });
      res.status(201).json({ id: recruiter.id });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "Email déjà utilisé." });
      }

      res.status(500).json({
        message:
          "Une erreur interne s'est produite lors de la création du recruteur.",
      });
    }
  },
];

// Updates an existing recruiter in the database
export const updateRecruiter = [
  param("id").isUUID().withMessage("L'ID doit être un UUID valide"),

  body("company")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le nom de l'entreprise ne peut pas être vide."),
  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("L'adresse ne peut pas être vide."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const recruiter = await Recruiter.findByPk(req.params.id);
      if (recruiter) {
        await recruiter.update(req.body);
        res.status(200).json({ id: recruiter.id });
      } else {
        res.status(404).json({ message: "Recruteur non trouvé" });
      }
    } catch (err) {
      res.status(500).json({
        message:
          "Une erreur interne s'est produite lors de la mise à jour du recruteur.",
      });
    }
  },
];

// Deletes a recruiter from the database
export const deleteRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findByPk(req.params.id);
    if (recruiter) {
      await recruiter.destroy();
      res.status(200).json({ id: recruiter.id });
    } else {
      res.status(404).json({ message: "Recruiter not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logs in a recruiter
export const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ where: { email } });

    if (!recruiter || !(await bcrypt.compare(password, recruiter.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!recruiter.isApproved) {
      return res
        .status(401)
        .json({ message: "Your account has not been approved yet" });
    }

    const passwordValid = await bcrypt.compare(password, recruiter.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: recruiter.id, email: recruiter.email, userType: "recruiter" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, userType: "recruiter" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const recruiterController = {
  getRecruiters,
  getRecruiterById,
  createRecruiter,
  updateRecruiter,
  deleteRecruiter,
  loginRecruiter,
};

export default recruiterController;
