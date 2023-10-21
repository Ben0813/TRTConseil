import Candidate from "../models/Candidate.js";

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
    try {
        const candidate = await Candidate.create(req.body);
        res.status(201).json({ id: candidate.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
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

    const candidateController = {
        getCandidates,
        getCandidateById,
        createCandidate,
        updateCandidate,
        deleteCandidate,
    };

export default candidateController;