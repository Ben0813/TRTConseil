import express from 'express';
const router = express.Router();
import administratorController from "../controllers/administratorController.js";
import { hashPassword } from "../middlewares/passwordMiddleware.js";

router.get('/', administratorController.getAdministrators);
router.get('/:id', administratorController.getAdministratorById);
router.post('/', hashPassword, administratorController.createAdministrator);
router.put('/:id', administratorController.updateAdministrator);
router.delete('/:id', administratorController.deleteAdministrator);

export default router;