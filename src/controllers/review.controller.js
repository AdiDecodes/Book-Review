import Review from "../models/review.model.js";

export const createReview = async (req, res) => {
  const { id: bookId } = req.params;
  const { rating = 0, comment = "" } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const userId = req.user.id;
  const existing = await Review.findOne({ bookId, userId });
  if (existing)
    return res.status(400).json({ message: "Review already exists" });
  try {
    const review = await Review.create({
      comment,
      rating: Number(rating),
      bookId,
      userId,
    });
    return res.status(201).json({
      message: "Review created",
      review : {
        comment: review.comment,
        rating: review.rating,
        bookId: review.bookId,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Error creating review", error });
  }
};

export const updateReview = async (req, res) => {
  const { id: bookId } = req.params;
  const { rating, comment } = req.body;
  if (!rating && !comment) {
    return res.status(400).json({ message: "rating or comment is required" });
  }
  try {
    const review = await Review.findOneAndUpdate(
      { userId: req.user.id, bookId },
      {
        $set: {
          rating: rating,
          comment: comment,
        },
      },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json({
      message: "Review updated",
      review: {
        comment: review.comment,
        rating: review.rating,
        bookId: review.bookId,
      },
    });
  } catch {
    res.status(400).json({ message: "Error updating review" });
  }
};

export const deleteReview = async (req, res) => {
  const { id: bookId } = req.params;
  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  try {
    const result = await Review.findOneAndDelete({
      userId: req.user.id,
      bookId: req.params.id,
    });
    if (!result) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch {
    res.status(400).json({ message: "Error deleting review" });
  }
};
