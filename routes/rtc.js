const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid')

// Room ID redirect
router.get('/doctor/chat', (req, res) => {
    res.send(`/${uuidV4()}`)
})

router.get('/patient/chat', (req, res) => {
    res.send(`/${uuidV4()}`)
})

router.get('/doctor/chat:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    })
})

router.get('/patient/chat:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    })
})


module.exports = router