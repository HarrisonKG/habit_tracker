var mongoose = require('mongoose');
var configDB = require('./database.js');

// connect to database 
mongoose.connect(configDB.url, {
  useMongoClient: true
}); 

mongoose.Promise = global.Promise;

module.exports = mongoose;