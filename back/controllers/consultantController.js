import Consultant from "../models/Consultant.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, param, validationResult } from "express-validator";

// Retrieves all consultants from the database
export const getConsultants = async (req, res) => {
  try {
    const consultants = await Consultant.findAll();
    res.status(200).json(consultants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieves a consultant with the specified ID from the database
export const getConsultantById = async (req, res) => {
  try {
    const consultant = await Consultant.findByPk(req.params.id);
    res.status(200).json(consultant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a new consultant in the database
export const createConsultant = [
  body("name").trim().notEmpty().withMessage("Le nom est requis."),
  body("firstname").trim().notEmpty().withMessage("Le prénom est requis."),
  body("email")
    .isEmail()
    .withMessage("L'email doit être une adresse email valide."),
  body("password")
    .isStrongPassword()
    .withMessage("Le mot de passe doit être sécurisé."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const consultant = await Consultant.create(req.body);
      res.status(201).json({ id: consultant.id });
    } catch (err) {
      res.status(500).json({
        message: "Une erreur interne s'est produite lors de la création.",
      });
    }
  },
];

// Updates an existing consultant in the database
export const updateConsultant = [
  param("id").isUUID().withMessage("L'ID doit être un UUID valide"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("L'email doit être une adresse email valide."),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le nom ne peut pas être vide."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const consultant = await Consultant.findByPk(req.params.id);
      if (consultant) {
        await consultant.update(req.body);
        res.status(200).json({ id: consultant.id });
      } else {
        res.status(404).json({ message: "Consultant non trouvé" });
      }
    } catch (err) {
      res.status(500).json({
        message: "Une erreur interne s'est produite lors de la mise à jour.",
      });
    }
  },
];

// Deletes a consultant from the database
export const deleteConsultant = async (req, res) => {
  try {
    const consultant = await Consultant.findByPk(req.params.id);
    if (consultant) {
      await consultant.destroy();
      res.status(200).json({ id: consultant.id });
    } else {
      res.status(404).json({ message: "Consultant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logs in a consultant
export const loginConsultant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const consultant = await Consultant.findOne({ where: { email } });

    if (!consultant || !(await bcrypt.compare(password, consultant.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: consultant.id, email: consultant.email, userType: "consultant" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, userType: "consultant" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const consultantController = {
  getConsultants,
  getConsultantById,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  loginConsultant,
};

export default consultantController;
