import Express from "express";
const router = Express.Router();
import postulationController from "../controllers/postulationController.js";

router.get("/", postulationController.getPostulations);
router.get("/:id", postulationController.getPostulationById);
router.post("/", postulationController.createPostulation);
router.put("/:id", postulationController.updatePostulation);
router.delete("/:id", postulationController.deletePostulation);

export default router;