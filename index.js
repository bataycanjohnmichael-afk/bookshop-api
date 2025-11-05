// index.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express(); // <-- create app first
app.use(cors());      // <-- now you can use it
app.use(bodyParser.json());

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Sample in-memory database
let books = [
  { isbn: "4521", title: "Harry Potter", author: "J.K. Rowling", reviews: { rating: 5 } },
  { isbn: "4342", title: "My Hero Academia", author: "Kohei Horikoshi", reviews: { rating: 4 } },
  { isbn: "4564", title: "One Punch Man", author: "Yusuke Murata", reviews: { rating: 5 } },
  { isbn: "7890", title: "Attack on Titan", author: "Hajime Isayama", reviews: { rating: 5 } },
  { isbn: "1234", title: "Demon Slayer", author: "Koyoharu Gotouge", reviews: { rating: 4 } }
];

let users = [];

// ------------------------
// API Routes
// ------------------------

// Home route serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 1. Get all books
app.get("/books", (req, res) => res.json(books));

// 2. Get book by ISBN
app.get("/books/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ msg: "Book not found" });
  res.json(book);
});

// 3. Get books by author
app.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = books.filter(b => b.author.toLowerCase().includes(author));
  res.json(result);
});

// 4. Get books by title
app.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = books.filter(b => b.title.toLowerCase().includes(title));
  res.json(result);
});

// 5. Get reviews by ISBN
app.get("/reviews/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ msg: "Book not found" });
  res.json(book.reviews);
});

// 6. Register new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: "Username and password required" });

  users.push({ username, password });
  res.json({ msg: "User added" });
});

// 7. Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  res.json({ msg: "Logged in" });
});

// ------------------------
// Start server
// ------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));