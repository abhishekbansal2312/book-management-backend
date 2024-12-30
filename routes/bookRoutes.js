const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// a. Create a New Book
router.post("/", (req, res) => {
  const { title, price, author, genre } = req.body;

  if (!title || !genre || !price || !author) {
    return res.status(400).json({ error: "Please provide all fields" });
  }
  const book = new Book({
    title,
    price,
    author,
    genre,
  });
  book
    .save()
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to add book", err });
    });
});

// b. Fetch All Books
router.get("/", (req, res) => {
  Book.find()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to fetch books" });
    });
});

// Get a Book by id
router.get("/id/:id", (req, res) => {
  const id = req.params.id;
  const book = Book.findOne(id);
  book
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to fetch book" });
    });
});

// Get a Book by title
router.get("/title/:title", (req, res) => {
  const paramsTitle = req.params.title;
  const book = Book.findOne({
    title: paramsTitle,
  });
  book
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to fetch book" });
    });
});

// c. Update a Book by Title
router.put("/:title", (req, res) => {
  const paramsTitle = req.params.title;
  const { title, description, price, author } = req.body;

  const book = Book.findOneAndUpdate(
    {
      title: paramsTitle,
    },
    {
      title,
      description,
      price,
      author,
    }
  );

  book
    .then((book) => {
      res.json({
        message: "Book updated successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to update" });
    });
});

// d. Delete a Book by Title
router.delete("/:title", (req, res) => {
  const paramsTitle = req.params.title;
  const book = Book.findOneAndDelete({
    title: paramsTitle,
  });
  book
    .then((book) => {
      res.json([
        {
          message: "Book deleted successfully",
        },
      ]);
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to delete" });
    });
});

// e. Search for Books by Genre (Optional)
router.get("/genre/:genre", (req, res) => {
  const genre = req.params.genre;
  Book.find({
    genre: genre,
  })
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(400).json({ error: "Unable to fetch books" });
    });
});

module.exports = router;
