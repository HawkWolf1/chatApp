const path = require('path')

//dirname returns directory name of the path
// process is the global process variable
// main is the main module that started our application
module.exports = path.dirname(process.mainModule.filename)