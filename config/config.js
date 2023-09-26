const mongoose = require('mongoose');




mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true
//   useCreateIndex: true,
//   useFindAndModify: false,
}).then(()=>{
    console.log('DB connected')
}).catch((err)=>{
    console.log('ERROR!!Database not connected')
    console.log(err)
})

