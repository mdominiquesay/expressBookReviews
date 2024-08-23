const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let usernamewithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (usernamewithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid login. Check username and password" });
  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.session.authorization.username;
  let selectedBook = Object.values(books).filter((book) => {
    return book.ISBN === ISBN;
  });
  if(selectedBook){
    if(selectedBook[0].reviews[username]){
      delete(selectedBook[0].reviews[username]);
      return res.status(200).json(books);
    }
    else{
      return res.status(208).json({ message: "No Review Found" });
    }
  }else {
    return res.status(208).json({ message: "Invalid ISBN" });
  }
  
  
});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username=req.session.authorization.username;
  const review = req.body.review;
  let selectedBook = Object.values(books).filter((book) => {
    return book.ISBN === ISBN;
  });
  if (selectedBook[0]) {
    if (selectedBook[0].reviews[username]) {
      selectedBook[0].reviews[username]=review;
      return res.status(200).json(books);
    }else{
      selectedBook[0].reviews[username]=review;
      return res.status(200).json(books);
    }
  }
  else {
    return res.status(208).json({ message: "Invalid ISBN" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
