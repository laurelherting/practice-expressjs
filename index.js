let express = require('express')
let app = express()

app.get('/', function (req, res) {
  res.send('Hello world')
})

app.get('/yo', function (req, res) {
  res.send('YO!')
})

let server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})
