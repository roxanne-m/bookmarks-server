'use strict';

const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('./logger');
const { bookmarks } = require('./store');

const bookmarkRouter = express.Router();    // importing express.router and exporting it at bottom
const bodyParser = express.json;

// GET & POST /bookmarks
bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post((req, res) => {
    const { title, url, description, rating } = req.body;

    // validate that all are input by user
    if (!title) {
      logger.error('Title is required.');
      return res.status(400).send('Invalid data');
    }

    if (!url) {
      logger.error('Url is required.');
      return res.status(400).send('Invalid data');
    }

    if (!description) {
      logger.error('Description is required.');
      return res.status(400).send('Invalid data');
    }

    if (!rating) {
      logger.error('Rating is required.');
      return res.status(400).send('Invalid data');
    }

    // get an id
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
    };

    bookmarks.push(bookmark);

    //Log the bookmark creation and send a response including a location header
    logger.info(`Bookmark with id ${id} created.`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

// GET & DELETE for /bookmarks/:id
bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((b) => b.id === id);

    // make sure found correct book
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Book Not Found.');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex((b) => b.id === id);

    if (bookmarkIndex === -1) {
      logger.error(`Book with id ${id} not found.`);
      return res.status(404).send('Not found.');
    }
    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Book with id ${id} deleted.`);
    res.status(204).end();
  });


module.exports = bookmarkRouter;
