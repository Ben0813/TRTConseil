import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ id: job.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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