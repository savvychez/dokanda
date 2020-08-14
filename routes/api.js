const express = require('express');
const router = express.Router();

router.get('/articles', (req, res, next) => {
    res.json({
        "hello": true,
    })
})

module.exports = router