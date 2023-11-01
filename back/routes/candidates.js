import Express from "express";
const router = Express.Router();
import candidateController from "../controllers/candidateController.js";
import { upload } from '../controllers/candidateController.js';
import multer from "multer";
import authenticate from "../middleware/authenticate.js";



router.post("/login", candidateController.loginCandidate);
router.get("/", candidateController.getCandidates);
router.get("/:id", candidateController.getCandidateById);
router.post("/", candidateController.createCandidate);
router.put("/:id", authenticate, upload.single('cv'), candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

export default router;

