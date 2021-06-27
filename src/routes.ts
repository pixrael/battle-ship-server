import { gameServer } from '.'
const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public'))
})

// Game page route.
router.post('/games', (req, res) => {
    // should create a new game and add it to the list of games
    const newGame = gameServer.createNewGame(req.body.mode, req.body['n-shots'])

    const response = {
        battleId: newGame.getGameId(),
    }

    res.send(JSON.stringify(response))
})

module.exports = router
