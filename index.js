import express from "express";
import connectDB from "./db.js";
import secrets from "./secrets.js";

//Routes
import userRoutes from "./src/routes/user.route.js";
import bookRoutes from "./src/routes/book.route.js";
import reviewRoutes from "./src/routes/review.route.js";

const { PORT } = secrets;

const app = express();
connectDB();

// We could have used CORS middleware here, but since we are testing this locally, I'm not using it 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Welcome to the Book Review API",
  });
});

app.use(userRoutes);
app.use(bookRoutes);
app.use(reviewRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
