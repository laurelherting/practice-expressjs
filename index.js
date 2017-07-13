let express = require('express')
let app = express()

let fs = require('fs')
let _ = require('lodash')
let users = []

fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    users.push(user)
  })

})

app.get('/', function (req, res) {
  let buffer = ''

  users.forEach(function (user) {
    buffer += '<a href="/' + user.username + '">' + user.name.full + '</a><br>'
  })
  res.send(buffer)
})

app.get('/ye', function (req, res) {
  res.send('YE!')
})

app.get('/:username', function (req, res) {
  let username = re.params.username
  res.send(username)
})

let server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})
