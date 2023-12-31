import Postulation from "../models/Postulation.js";

// Retrieves all postulations from the database
export const getPostulations = async (req, res) => {
  try {
    const postulations = await Postulation.findAll();
    res.status(200).json(postulations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieves a postulation with the specified ID from the database
export const getPostulationById = async (req, res) => {
  try {
    const postulation = await Postulation.findByPk(req.params.id);
    res.status(200).json(postulation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a new postulation in the database
export const createPostulation = async (req, res) => {
  try {
    const postulation = await Postulation.create(req.body);
    res.status(201).json({ id: postulation.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Updates an existing postulation in the database
export const updatePostulation = async (req, res) => {
  try {
    const postulation = await Postulation.findByPk(req.params.id);
    if (postulation) {
      await postulation.update(req.body);
      res.status(200).json({ id: postulation.id });
    } else {
      res.status(404).json({ message: "Postulation not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deletes a postulation from the database
export const deletePostulation = async (req, res) => {
  try {
    const postulation = await Postulation.findByPk(req.params.id);
    if (postulation) {
      await postulation.destroy();
      res.status(200).json({ id: postulation.id });
    } else {
      res.status(404).json({ message: "Postulation not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const postulationController = {
  getPostulations,
  getPostulationById,
  createPostulation,
  updatePostulation,
  deletePostulation,
};

export default postulationController;
