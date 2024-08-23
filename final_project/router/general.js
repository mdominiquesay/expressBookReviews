const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  else {
    return res.status(404).json({ message: "Unable to register to user." });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },6000)})
    myPromise.then((result) => {
      res.send(result);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  let myPromise = new Promise((resolve,reject) => {
  setTimeout(() => {
    let selectedBooks =  Object.values(books).filter((book) => {
      return book.ISBN === ISBN ;
    });
    resolve(selectedBooks)
  },6000)})
  myPromise.then((result) => {
    res.send(result); 
  })

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let selectedBooks =  Object.values(books).filter((book) => {
    return book.author === author ;
  });
  res.send(selectedBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      let selectedBooks =  Object.values(books).filter((book) => {
        return book.title === title ;
      });
      resolve(selectedBooks)
    },6000)})
    myPromise.then((result) => {
      res.send(result);
    })
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  let selectedBooks =  Object.values(books).filter((book) => {
    return book.ISBN === ISBN ;
  });
  res.send(selectedBooks[0].reviews);
});

module.exports.general = public_users;
