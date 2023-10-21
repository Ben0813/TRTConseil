import Express from "express";
const router = Express.Router();
import recruiterController from "../controllers/recruiterController.js";
import { hashPassword } from "../middlewares/passwordMiddleware.js";


router.get("/", recruiterController.getRecruiters);
router.get("/:id", recruiterController.getRecruiterById);
router.post("/", hashPassword, recruiterController.createRecruiter);
router.put("/:id", recruiterController.updateRecruiter);
router.delete("/:id", recruiterController.deleteRecruiter);

export default router;