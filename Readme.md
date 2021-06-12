Fast, unopinionated, minimalist web framework for [node](http://nodejs.org).

```js
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
```

## Installation

This is an express nodejs server to serve battleship games.

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

locally run:
1-Run 'npm install'
2-Run 'npm start'. This will watch changes of any .ts files
3-Run 'npm run dev' This will serve index.js at localhost:3000
4-Make any changes to any .ts file and save will create the js files in the directory dist
