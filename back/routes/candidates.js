import Express from "express";
const router = Express.Router();
import candidateController from "../controllers/candidateController.js";
import { upload } from '../controllers/candidateController.js';


router.post("/login", candidateController.loginCandidate);
router.get("/", candidateController.getCandidates);
router.get("/:id", candidateController.getCandidateById);
router.post("/", candidateController.createCandidate);
router.put("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);
router.put('/update-cv', upload.single('cv'), candidateController.uploadCV);


export default router;
