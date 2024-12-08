import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
