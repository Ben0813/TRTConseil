import Express from "express";
const router = Express.Router();
import jobController from "../controllers/jobController.js";

router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJobById);
router.post("/", jobController.createJob);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

export default router;
