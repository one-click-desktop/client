var fs = require('fs')

exports.default = async function (context) {
    fs.copyFile('config.json', 'release/config.json', function (err) { if (err) throw err })
}