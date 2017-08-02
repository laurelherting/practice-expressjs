const express = require('express');
const helpers = require('./helpers');
const fs = require('fs');

const User = require('./db').User;

const router = express.Router({
  mergeParams: true
});

router.use((req, res, next) => {
  console.log(req.method, 'for', req.params.username, 'at', req.path);
  next()
});

router.get('/', (req, res) => {
  const username = req.params.username;
  User.findOne({username: username}, (err, user) => {
    res.render('user', {
      user: user,
      address: user.location
    });
  });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.put('/', (req, res) => {
  const username = req.params.username;

  User.findOneAndUpdate({username: username}, {location: req.body}, (err, user) => {
    res.end()
  });
});

router.delete('/', (req, res) => {
  const fp = helpers.getUserFilePath(req.params.username);
  fs.unlinkSync(fp) // delete the file
  res.sendStatus(200)
});

module.exports = router
