import { Router } from "express";
import {
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/authentication.js";
const router = Router();

router.put("/reviews/:id", authenticate, updateReview);
router.delete("/reviews/:id", authenticate, deleteReview);

export default router;
