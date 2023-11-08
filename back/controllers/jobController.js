import Job from "../models/Job.js";
import { body, param, validationResult } from "express-validator";

// Retrieves all jobs from the database
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieves a job with the specified ID from the database
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a new job in the database
export const createJob = [
  body("title").trim().notEmpty().withMessage("Le titre est requis."),
  body("location").trim().notEmpty().withMessage("L'emplacement est requis."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La description est requise."),
  body("id_recruiter")
    .isUUID()
    .withMessage("L'ID du recruteur doit être un UUID valide"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const job = await Job.create(req.body);
      res.status(201).json({ id: job.id });
    } catch (err) {
      res.status(500).json({
        message:
          "Une erreur interne s'est produite lors de la création de la tâche.",
      });
    }
  },
];

// Updates an existing job in the database
export const updateJob = [
  param("id").isUUID().withMessage("L'ID du job doit être un UUID valide"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le titre est requis."),
  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("L'emplacement est requis."),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La description est requise."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const job = await Job.findByPk(req.params.id);
      if (job) {
        await job.update(req.body);
        res.status(200).json({ id: job.id });
      } else {
        res.status(404).json({ message: "Job not found" });
      }
    } catch (err) {
      res.status(500).json({
        message:
          "Une erreur interne s'est produite lors de la mise à jour du job.",
      });
    }
  },
];

// Deletes a job from the database
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (job) {
      await job.destroy();
      res.status(200).json({ id: job.id });
    } else {
      res.status(404).json({ message: "Job non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const jobController = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};

export default jobController;
