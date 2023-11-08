import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import dotenv from "dotenv";
import authenticate from "./middleware/authenticate.js";
import nodemailer from "nodemailer";

dotenv.config();

// Import models
import Recruiter from "./models/Recruiter.js";
import Candidate from "./models/Candidate.js";
import Consultant from "./models/Consultant.js";
import Administrator from "./models/Administrator.js";
import Job from "./models/Job.js";
import Postulation from "./models/Postulation.js";
import "./models/initModels.js";

// Hooks for password hashing
const addHashingHooks = (model) => {
  model.addHook("beforeCreate", async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  model.addHook("beforeUpdate", async (user) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
};

addHashingHooks(Candidate);
addHashingHooks(Recruiter);
addHashingHooks(Consultant);
addHashingHooks(Administrator);

// Nodemailer transporter object for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Import routes
import recruiterRoutes from "./routes/recruiters.js";
import candidateRoutes from "./routes/candidates.js";
import consultantRoutes from "./routes/consultants.js";
import administratorRoutes from "./routes/administrators.js";
import jobRoutes from "./routes/jobs.js";
import postulationRoutes from "./routes/postulations.js";

// Create express application
const app = express();

// Using express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Using middleware
app.use(cors());
app.use(express.json());

// Using routes CRUD
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/consultants", consultantRoutes);
app.use("/api/administrators", administratorRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/postulations", postulationRoutes);

// Using specific routes
app.get("/api/pending-accounts", authenticate, async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const recruiters = await Recruiter.findAll();

    const pendingAccounts = [
      ...candidates.map((c) => ({
        id: c.id,
        email: c.email,
        type: "candidate",
        isApproved: c.isApproved,
      })),
      ...recruiters.map((r) => ({
        id: r.id,
        email: r.email,
        type: "recruiter",
        isApproved: r.isApproved,
      })),
    ];

    res.json(pendingAccounts);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des comptes en attente.",
    });
  }
});

app.put("/api/approve-account", authenticate, async (req, res) => {
  const { id, type, isApproved } = req.body;
  try {
    if (type === "candidate") {
      await Candidate.update({ isApproved }, { where: { id } });
    } else if (type === "recruiter") {
      await Recruiter.update({ isApproved }, { where: { id } });
    } else {
      return res.status(400).json({ error: "Type de compte inconnu." });
    }
    res.json({ message: "Statut du compte mis à jour avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du statut du compte." });
  }
});

app.post("/api/reject-account", authenticate, async (req, res) => {
  const { id, type } = req.body;
  try {
    if (type === "candidate") {
      await Candidate.destroy({ where: { id } });
    } else if (type === "recruiter") {
      await Recruiter.destroy({ where: { id } });
    } else {
      return res.status(400).json({ error: "Type de compte inconnu." });
    }
    res.json({ message: "Compte rejeté avec succès." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du rejet du compte." });
  }
});

app.get("/api/pending-jobs", authenticate, async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des jobs." });
  }
});

app.put("/api/approve-job", authenticate, async (req, res) => {
  const { id, isApproved } = req.body;
  try {
    await Job.update({ isApproved }, { where: { id } });
    res.json({ message: "Statut du job mis à jour avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du statut du job." });
  }
});

app.get("/api/approved-jobs", authenticate, async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { isApproved: true } });
    res.json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des jobs validés." });
  }
});

app.get("/api/jobs/byRecruiter/:recruiterId", async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;
    const jobs = await Job.findAll({
      where: { id_recruiter: recruiterId },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des jobs." });
  }
});

app.get("/api/postulations/byJob/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const postulations = await Postulation.findAll({
      where: { id_job: jobId },
      include: [
        { model: Candidate, as: "candidate", attributes: ["name"] },
        { model: Job, as: "job", attributes: ["title"] },
      ],
    });
    res.json(postulations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des postulations." });
  }
});

app.post("/api/postulations", authenticate, async (req, res) => {
  const { id_candidate, id_job } = req.body;
  try {
    const newPostulation = await Postulation.create({ id_candidate, id_job });
    res.status(200).json(newPostulation);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la postulation." });
  }
});

app.get("/api/pending-postulations", authenticate, async (req, res) => {
  try {
    const postulations = await Postulation.findAll({
      where: { isApproved: false },
      include: [
        {
          model: Candidate,
          as: "candidate",
          attributes: ["name"],
        },
        {
          model: Job,
          as: "job",
          attributes: ["title"],
        },
      ],
    });
    res.json(postulations);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des postulations en attente.",
    });
  }
});

app.put("/api/approve-postulation", authenticate, async (req, res) => {
  const { id, isApproved } = req.body;
  try {
    await Postulation.update({ isApproved }, { where: { id } });

    // Retrieving additional information for the email
    const postulation = await Postulation.findByPk(id, {
      include: [
        {
          model: Job,
          as: "job",
          include: [
            {
              model: Recruiter,
              as: "recruiter",
            },
          ],
        },
        {
          model: Candidate,
          as: "candidate",
        },
      ],
    });

    const jobId = postulation.job.id;

    const postulations = await Postulation.findAll({
      where: { id_job: jobId },
      include: [
        { model: Candidate, as: "candidate" },
        { model: Job, as: "job", attributes: ["title"] },
      ],
    });

    const recruiterEmail = postulation.job.recruiter.email;
    const jobTitle = postulation.job.title;
    const candidateName = `${postulation.candidate.name} ${postulation.candidate.firstname}`;
    const candidateCV = postulation.candidate.cvPath;

    // Preparing the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recruiterEmail,
      subject: "Postulation approuvée",
      text: `La postulation de ${candidateName} pour le poste de "${jobTitle}" a été approuvée.`,
      attachments: [
        {
          filename: candidateCV.split("/").pop(),
          path: candidateCV,
        },
      ],
    };

    // Sending the email
    transporter.sendMail(mailOptions, (error, info) => {});

    res.json({ message: "Postulation mise à jour avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la postulation." });
  }
});

// Asynchrones function to create the tables in a specific order
const createTables = async () => {
  try {
    await Recruiter.sync({ alter: false });
    await Candidate.sync({ alter: false });
    await Consultant.sync({ alter: false });
    await Administrator.sync({ alter: false });
    await Job.sync({ alter: false });

    // Creating of this table last because of its dependencies on the others
    await Postulation.sync({ alter: false });
    console.log("Table Postulation créée");
  } catch (error) {
    console.log(`Erreur lors de la création des tables : ${error}`);
  }
};

// Calling the function to create the tables
createTables();

export default app;
