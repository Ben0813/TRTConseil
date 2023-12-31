import Express from "express";
const router = Express.Router();
import recruiterController from "../controllers/recruiterController.js";

router.post("/login", recruiterController.loginRecruiter);
router.get("/", recruiterController.getRecruiters);
router.get("/:id", recruiterController.getRecruiterById);
router.post("/", recruiterController.createRecruiter);
router.put("/:id", recruiterController.updateRecruiter);
router.delete("/:id", recruiterController.deleteRecruiter);

export default router;
