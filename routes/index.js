var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Onesmus Auto Shop | Home',
    description: 'Welcome to Onesmus Auto Shop, your premier dealership for luxury and classic cars.'
  });
});

module.exports = router;
