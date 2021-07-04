import { Router } from 'express'
import { PlatformPath } from 'path'
import GamesServer from './models/games-server'

export default class ServerRouter {
    private path: PlatformPath
    private router: Router
    private dirname: string
    private gameServer: GamesServer

    constructor(
        router: Router,
        path: PlatformPath,
        dirname: string,
        gameServer: GamesServer
    ) {
        this.path = path
        this.router = router
        this.dirname = dirname
        this.gameServer = gameServer
    }

    defineRoutes() {
        this.router.get('/', (req, res) => {
            res.sendFile(this.path.join(this.dirname, 'public'))
        })

        this.router.post('/games', (req, res) => {
            console.log('cool now this module is a class!!!')

            // should create a new game and add it to the list of games
            const newGame = this.gameServer.createNewGame(
                req.body.mode,
                req.body['n-shots']
            )

            const response = {
                battleId: newGame.getGameId(),
            }

            res.send(JSON.stringify(response))
        })

        return this.router
    }
}
