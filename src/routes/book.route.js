import { Router } from "express";
import { createBook, searchBooks, getBookById, books, updateBook } from "../controllers/book.controller.js";
import { createReview } from "../controllers/review.controller.js";    
import { authenticate } from "../middlewares/authentication.js";

const router = Router();

router.post("/books", authenticate, createBook);
router.get("/books", books);
router.get("/books/:id", getBookById);
router.put("/books/:id", authenticate, updateBook);
router.post("/books/:id/reviews", authenticate, createReview); // Since this is related to books, I have kept it here
router.get("/search", searchBooks);

export default router;