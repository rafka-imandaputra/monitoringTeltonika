const express = require("express")
const router = express.Router()
const test = require("../controllers/test")

//TEST
router.get('/alat',test.getAlat)
router.get('/alat/:id',test.getAlatbyid)
router.post('/alat',test.createAlat)

module.exports = router