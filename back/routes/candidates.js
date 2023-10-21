import Express from "express";
const router = Express.Router();
import candidateController from "../controllers/candidateController.js";
import { hashPassword } from "../middlewares/passwordMiddleware.js";

router.get("/", candidateController.getCandidates);
router.get("/:id", candidateController.getCandidateById);
router.post("/", hashPassword, candidateController.createCandidate);
router.put("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

export default router;
