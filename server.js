const mongoose = require('mongoose')
const app = require('./app')

// const DB_HOST = 'mongodb+srv://Slava:5zhexnFwmTwRLojT@cluster0.6f0dtia.mongodb.net/db-contacts?retryWrites=true&w=majority'
// 5zhexnFwmTwRLojT
mongoose.connect(process.env.DB_HOST).then(() => {
  app.listen(3000, () => {
    console.log("Database connection successful")
  })
}).catch(err => { 
  console.log(err.message);
  process.exit(1);
})


