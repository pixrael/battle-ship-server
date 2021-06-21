var fs = require('fs')

export const boardLogger = (board: any[][], pathFile: string) => {
    let boardString = ''

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            boardString += board[i][j] + ','
        }

        boardString += '\n'
    }

    fs.writeFile(pathFile, boardString, function (err) {
        if (err) {
            return console.log(err)
        }
        console.log('The file was saved!')
    })
}
