import express from "express";
const router = express.Router();
import consultantController from "../controllers/consultantController.js";

router.post("/login", consultantController.loginConsultant);
router.get("/", consultantController.getConsultants);
router.get("/:id", consultantController.getConsultantById);
router.post("/", consultantController.createConsultant);
router.put("/:id", consultantController.updateConsultant);
router.delete("/:id", consultantController.deleteConsultant);

export default router;
