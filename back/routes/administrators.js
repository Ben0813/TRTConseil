import express from 'express';
const router = express.Router();
import administratorController from "../controllers/administratorController.js";

router.post('/login', administratorController.loginAdministrator);
router.get('/', administratorController.getAdministrators);
router.get('/:id', administratorController.getAdministratorById);
router.post('/', administratorController.createAdministrator);
router.put('/:id', administratorController.updateAdministrator);
router.delete('/:id', administratorController.deleteAdministrator);

export default router;