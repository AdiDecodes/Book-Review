import Book from "../models/book.model.js";
import Review from "../models/review.model.js";

export const createBook = async (req, res) => {
  const {
    title,
    author,
    genre,
    description = "",
    coverImage = "",
    publishedDate = "",
  } = req.body;
  if (!title || !author || !genre) {
    return res
      .status(400)
      .json({ message: "title, author and genre are required" });
  }
  try {
    const book = await Book.create({
      title,
      author,
      genre,
      description,
      coverImage,
      publishedDate,
    });
    res.status(201).json(book);
  } catch {
    res.status(400).json({ message: "Error creating book" });
  }
};

// Adding this bonus controller to update book details post-creation :)
export const updateBook = async (req, res) => {
  const { id: bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  const allowedFields = [
    "title",
    "author",
    "genre",
    "description",
    "coverImage",
    "publishedDate",
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: `Invalid fields: ${invalidFields.join(", ")}`,
    });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  try {
    const book = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({
      message: "Book updated successfully",
      book: {
        id: book._id,
        title: book.title,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating book", error });
  }
};

export const books = async (req, res) => {
  try {
    const { page = 1, limit = 5, author, genre } = req.query;
    const query = {};

    if (author) {
      const authorList = author.includes(",")
        ? author.split(",").map((a) => a.trim())
        : author;

      if (Array.isArray(authorList)) {
        query.author = { $in: authorList };
      } else {
        query.author = authorList;
      }
    }

    if (genre) {
      const genreList = genre.includes(",")
        ? genre.split(",").map((g) => g.trim())
        : genre;

      if (Array.isArray(genreList)) {
        query.genre = { $in: genreList };
      } else {
        query.genre = genreList;
      }
    }

    const books = await Book.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalBooks: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      nextPageAvailable: count > page * limit,
      previousPageAvailable: page > 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getBookById = async (req, res) => {
  const { id: bookId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  try {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { _id, __v, ...rest } = book.toObject();
    const transformedBook = {
      ...rest,
      id: _id,
    };

    const totalReviews = await Review.countDocuments({ bookId });

    const reviews = await Review.find({ bookId })
      .select({
        _id: 0,
        __v: 0,
        bookId: 0,
        userId: 0,
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .exec();

    const allReviews = await Review.find({ bookId });
    const avgRating = allReviews.length
      ? allReviews.reduce((acc, cur) => acc + cur.rating, 0) / allReviews.length
      : 0;

    res.json({
      book: transformedBook,
      averageRating: avgRating,
      metaReviews: {
        reviews,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limitNum),
        currentPage: pageNum,
        nextPageAvailable: totalReviews > pageNum * limitNum,
        previousPageAvailable: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving book:", error);
    res.status(404).json({ message: "Book not found", error: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { query, page = 1, limit = 5 } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ message: "Search query parameter 'q' is required" });
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const regex = new RegExp(query, "i");

    const searchCriteria = {
      $or: [{ title: regex }, { author: regex }],
    };

    const books = await Book.find(searchCriteria)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .exec();

    const count = await Book.countDocuments(searchCriteria);

    if (books.length === 0) {
      return res.status(404).json({
        message: "No books found matching your search criteria",
      });
    }

    res.json({
      books,
      totalBooks: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      nextPageAvailable: count > pageNum * limitNum,
      previousPageAvailable: pageNum > 1,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "An error occurred while searching for books",
      error: error.message,
    });
  }
};
