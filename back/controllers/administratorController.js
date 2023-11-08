import Administrator from "../models/Administrator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, param, validationResult } from "express-validator";

// Retrieves all administrators from the database
export const getAdministrators = async (req, res) => {
  try {
    const administrators = await Administrator.findAll();
    res.status(200).json(administrators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieves an administrator with the specified ID from the database
export const getAdministratorById = async (req, res) => {
  try {
    const administrator = await Administrator.findByPk(req.params.id);
    res.status(200).json(administrator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a new administrator in the database
export const createAdministrator = [
  body("name").trim().notEmpty().withMessage("Le nom est requis."),
  body("firstname").trim().notEmpty().withMessage("Le prénom est requis."),
  body("email")
    .isEmail()
    .withMessage("L'email doit être une adresse email valide."),
  body("password")
    .isStrongPassword()
    .withMessage("Le mot de passe n'est pas assez sécurisé."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const administrator = await Administrator.create(req.body);
      res.status(201).json({ id: administrator.id });
    } catch (err) {
      res.status(500).json({ message: "Une erreur interne s'est produite." });
    }
  },
];

// Updates an existing administrator in the database
export const updateAdministrator = [
  param("id").isUUID().withMessage("L'ID doit être un UUID valide"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("L'email doit être une adresse email valide."),
  body("password")
    .optional()
    .isStrongPassword()
    .withMessage("Le mot de passe n'est pas assez sécurisé."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const administrator = await Administrator.findByPk(req.params.id);
      if (administrator) {
        await administrator.update(req.body);
        res.status(200).json({ id: administrator.id });
      } else {
        res.status(404).json({ message: "Administrateur non trouvé" });
      }
    } catch (err) {
      res.status(500).json({
        message: "Une erreur interne s'est produite lors de la mise à jour.",
      });
    }
  },
];

// Deletes an administrator from the database
export const deleteAdministrator = async (req, res) => {
  try {
    const administrator = await Administrator.findByPk(req.params.id);
    if (administrator) {
      await administrator.destroy();
      res.status(200).json({ id: administrator.id });
    } else {
      res.status(404).json({ message: "Administrateur non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logs in an administrator
export const loginAdministrator = async (req, res) => {
  try {
    const { email, password } = req.body;
    const administrator = await Administrator.findOne({ where: { email } });

    if (
      !administrator ||
      !(await bcrypt.compare(password, administrator.password))
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: administrator.id,
        email: administrator.email,
        userType: "administrator",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, userType: "administrator" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// The administrator controller object
const administratorController = {
  getAdministrators,
  getAdministratorById,
  createAdministrator,
  updateAdministrator,
  deleteAdministrator,
  loginAdministrator,
};

export default administratorController;
