const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'))
})

// Game page route.
router.post('/game', (req, res) => {
  // should create a new game and add it to the list of games
  const { battleName } = req.body

  res.send(`create a game ${battleName}`)
})

module.exports = router
