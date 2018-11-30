var express = require('express');
var router = express.Router();
var controller = require('../controller');


router.get('/', controller.home);

router.get('/login', controller.login);

router.get('/oauthredirect', controller.oauthredirect);


module.exports = router;