import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(bodyParser.json());

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (CSS/JS if any)
app.use(express.static(__dirname));

// Sample in-memory database
let books = [
  { isbn: "1111", title: "Sample Book A", author: "Author A", reviews: {} },
  { isbn: "4521", title: "Harry Potter", author: "J.K. Rowling", reviews: { rating: 5 } },
  { isbn: "4342", title: "My Hero Academia", author: "Kohei Horikoshi", reviews: { rating: 4 } },
  { isbn: "4564", title: "One Punch Man", author: "Yusuke Murata, One", reviews: { rating: 5 } },
  { isbn: "4566", title: "Naruto", author: "Masashi Kishimoto", reviews: { rating: 4 } },
  { isbn: "4567", title: "Attack on Titan", author: "Hajime Isayama", reviews: { rating: 5 } },
  { isbn: "4568", title: "Fullmetal Alchemist", author: "Hiromu Arakawa", reviews: { rating: 5 } },
  { isbn: "4893", title: "Death Note", author: "Tsugumi Ohba", reviews: { rating: 5 } },
  { isbn: "4894", title: "Demon Slayer", author: "Koyoharu Gotouge", reviews: { rating: 4 } },
  { isbn: "4895", title: "Bleach", author: "Tite Kubo", reviews: { rating: 4 } },
  { isbn: "4896", title: "Dragon Ball", author: "Akira Toriyama", reviews: { rating: 5 } }
];

let users = [];

// Serve HTML front-end
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API Routes
app.get("/books", (req, res) => res.json(books));
app.get("/books/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ msg: "Book not found" });
  res.json(book);
});
app.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  res.json(books.filter(b => b.author.toLowerCase().includes(author)));
});
app.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  res.json(books.filter(b => b.title.toLowerCase().includes(title)));
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

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));