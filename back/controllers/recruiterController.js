import Recruiter from "../models/Recruiter.js";

export const getRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.findAll();
        res.status(200).json(recruiters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getRecruiterById = async (req, res) => {
    try {
        const recruiter = await Recruiter.findByPk(req.params.id);
        res.status(200).json(recruiter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createRecruiter = async (req, res) => {
    try {
        const recruiter = await Recruiter.create(req.body);
        res.status(201).json({ id: recruiter.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateRecruiter = async (req, res) => {
    try {
        const recruiter = await Recruiter.findByPk(req.params.id);
        if (recruiter) {
            await recruiter.update(req.body);
            res.status(200).json({ id: recruiter.id });
        } else {
            res.status(404).json({ message: "Recruiter not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

const recruiterController = {
    getRecruiters,
    getRecruiterById,
    createRecruiter,
    updateRecruiter,
    deleteRecruiter,
};

export default recruiterController;