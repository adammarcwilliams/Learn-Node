const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('It works')
  // res.render();
});

module.exports = router;
