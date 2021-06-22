import * as Random from '../utils/random'
const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public'))
})

// Game page route.
router.post('/games', (req, res) => {
    // should create a new game and add it to the list of games

    const response = {
        battleId: Random.randomBetween(1000, 9999),
    }

    res.send(JSON.stringify(response))
})

module.exports = router
