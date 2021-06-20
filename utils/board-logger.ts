var fs = require('fs')

export const boardLogger = (board: any[][], pathFile: string) => {
    fs.writeFile('/tmp/test', 'Hello world', function (err) {
        if (err) {
            return console.log(err)
        }
        console.log('The file was saved!')
    })
}
