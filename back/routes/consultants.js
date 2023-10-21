import express from "express";
const router = express.Router();
import consultantController from "../controllers/consultantController.js";
import { hashPassword } from "../middlewares/passwordMiddleware.js";

router.get("/", consultantController.getConsultants);
router.get("/:id", consultantController.getConsultantById);
router.post("/", hashPassword, consultantController.createConsultant);
router.put("/:id", consultantController.updateConsultant);
router.delete("/:id", consultantController.deleteConsultant);

export default router;
