import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Sample books
let books = [
  { isbn: "4521", title: "Harry Potter", author: "J.K Rowling", reviews: { rating: 5 } },
  { isbn: "4342", title: "My Hero Academia", author: "Kohei Horikoshi", reviews: { rating: 4 } },
  { isbn: "4564", title: "One Punch Man", author: "Yusuke Murata, One", reviews: { rating: 5 } },
  { isbn: "4789", title: "Naruto", author: "Masashi Kishimoto", reviews: { rating: 5 } },
  { isbn: "4890", title: "Attack on Titan", author: "Hajime Isayama", reviews: { rating: 5 } }
];

let users = [];

// API Routes
app.get("/books", (req, res) => res.json(books));
app.get("/books/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ msg: "Book not found" });
  res.json(book);
});
app.get("/author/:author", (req, res) => {
  const result = books.filter(b => b.author.toLowerCase().includes(req.params.author.toLowerCase()));
  res.json(result);
});
app.get("/title/:title", (req, res) => {
  const result = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
  res.json(result);
});
app.get("/reviews/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ msg: "Book not found" });
  res.json(book.reviews);
});
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: "Username and password required" });
  users.push({ username, password });
  res.json({ msg: "User added" });
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });
  res.json({ msg: "Logged in" });
});

// Root route
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));