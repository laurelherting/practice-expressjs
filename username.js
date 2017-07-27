const express = require('express');
const helpers = require('./helpers');
const fs = require('fs');

const router = express.Router({
  mergeParams: true
});

module.exports = router
