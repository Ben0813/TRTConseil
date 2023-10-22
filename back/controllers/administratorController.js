import Administrator from "../models/Administrator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getAdministrators = async (req, res) => {
    try {
        const administrators = await Administrator.findAll();
        res.status(200).json(administrators);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

export const getAdministratorById = async (req, res) => {
    try {
        const administrator = await Administrator.findByPk(req.params.id);
        res.status(200).json(administrator);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

export const createAdministrator = async (req, res) => {
    try {
        const administrator = await Administrator.create(req.body);
        res.status(201).json({ id: administrator.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

export const updateAdministrator = async (req, res) => {
    try {
        const administrator = await Administrator.findByPk(req.params.id);
        if (administrator) {
            await administrator.update(req.body);
            res.status(200).json({ id: administrator.id });
        } else {
            res.status(404).json({ message: "Administrator not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

export const deleteAdministrator = async (req, res) => {
    try {
        const administrator = await Administrator.findByPk(req.params.id);
        if (administrator) {
            await administrator.destroy();
            res.status(200).json({ id: administrator.id });
        } else {
            res.status(404).json({ message: "Administrator not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

    export const loginAdministrator = async (req, res) => {
        try {
          const { email, password } = req.body;
          const administrator = await Administrator.findOne({ where: { email } });
      
          if (!administrator || !(await bcrypt.compare(password, administrator.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
          }
      
          const token = jwt.sign(
            { id: administrator.id, email: administrator.email },
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

    const administratorController = {
        getAdministrators,
        getAdministratorById,
        createAdministrator,
        updateAdministrator,
        deleteAdministrator,
    };

export default administratorController;