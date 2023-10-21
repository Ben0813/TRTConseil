import Administrator from "../models/Administrator.js";

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

    const administratorController = {
        getAdministrators,
        getAdministratorById,
        createAdministrator,
        updateAdministrator,
        deleteAdministrator,
    };

export default administratorController;