const fs = require('fs')

export const boardLogger = (board: any[][], pathFile: string) => {
    let boardString = ''

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (j === 0) boardString += '['

            boardString += ` ${board[i][j]}`

            if (j === board[0].length - 1) boardString += '],'
            else boardString += ' ,'
        }

        boardString += '\n'
    }

    fs.writeFile(pathFile, boardString, (err) => {
        if (err) {
            // eslint-disable-next-line no-console
            return console.log(err)
        }
    })
}

export const boardConsoleLogger = (board: any[][]) => {
    let boardString = ''

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (j === 0) boardString += '['

            boardString += ` ${board[i][j]}`

            if (j === board[0].length - 1) boardString += '],'
            else boardString += ' ,'
        }

        boardString += '\n'
    }

    console.log(boardString)
}
