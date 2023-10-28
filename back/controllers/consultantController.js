import Consultant from "../models/Consultant.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getConsultants = async (req, res) => {
    try {
        const consultants = await Consultant.findAll();
        res.status(200).json(consultants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getConsultantById = async (req, res) => {
    try {
        const consultant = await Consultant.findByPk(req.params.id);
        res.status(200).json(consultant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createConsultant = async (req, res) => {
    try {
        const consultant = await Consultant.create(req.body);
        res.status(201).json({ id: consultant.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateConsultant = async (req, res) => {
    try {
        const consultant = await Consultant.findByPk(req.params.id);
        if (consultant) {
            await consultant.update(req.body);
            res.status(200).json({ id: consultant.id });
        } else {
            res.status(404).json({ message: 'Consultant not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteConsultant = async (req, res) => {
    try {
        const consultant = await Consultant.findByPk(req.params.id);
        if (consultant) {
            await consultant.destroy();
            res.status(200).json({ id: consultant.id });
        } else {
            res.status(404).json({ message: 'Consultant not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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