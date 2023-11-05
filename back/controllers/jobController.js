import Job from "../models/Job.js";

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
export const createJob = async (req, res) => {
  const { title, location, description, id_recruiter } = req.body;
  try {
    const job = await Job.create({
      title,
      location,
      description,
      id_recruiter,
    });
    res.status(201).json({ id: job.id });
  } catch (err) {
    console.log("Erreur complète: ", err);
    res.status(500).json({ message: err.message });
  }
};

// Updates an existing job in the database
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (job) {
      await job.update(req.body);
      res.status(200).json({ id: job.id });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deletes a job from the database
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (job) {
      await job.destroy();
      res.status(200).json({ id: job.id });
    } else {
      res.status(404).json({ message: "Job not found" });
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
