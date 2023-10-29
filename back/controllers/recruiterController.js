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
    console.log('Entrée dans createRecruiter'); 
    console.log('Données reçues:', req.body); 
    
    const { name, firstname, email, password, cv } = req.body;
    if (!name || !firstname || !email || !password ) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
  
    try {
      const recruiter = await Recruiter.create({
        ...req.body,
        isApproved: false 
      });
      res.status(201).json({ id: recruiter.id });
    } catch (err) {
      console.log('Erreur:', err); 
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email déjà utilisé.' });
      }
      res.status(500).json({ message: 'Une erreur interne s\'est produite.' });
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
  
      if (!recruiter.isApproved) {
        return res.status(401).json({ message: "Your account has not been approved yet" });
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