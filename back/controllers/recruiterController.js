import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    console.log('req.body dans createRecruiter:', req.body);
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

export const loginRecruiter = async (req, res) => {
    try {
      const { email, password } = req.body;
      const recruiter = await Recruiter.findOne({ where: { email } });
  
      if (!recruiter || !(await bcrypt.compare(password, recruiter.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { id: recruiter.id, email: recruiter.email },
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