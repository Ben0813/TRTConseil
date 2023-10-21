import Express from "express";
const router = Express.Router();
import candidateController from "../controllers/candidateController.js";

router.get("/", candidateController.getCandidates);
router.get("/:id", candidateController.getCandidateById);
router.post("/", candidateController.createCandidate);
router.put("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

export default router;
