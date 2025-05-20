import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publishedDate: { type: Date, default: Date.now },
  description: { type: String },
  coverImage: { type: String },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
