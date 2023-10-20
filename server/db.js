// const {MongoClient} = require('mongodb')
//
// const URL = 'mongodb://127.0.0.1:27017/auth'
//
// let dbCollection
//
// module.exports = {
//     connectToDb: (cb) => {
//         MongoClient
//             .connect(URL)
//             .then((client) => {
//                 console.log('Connected to MongoDB')
//                 dbCollection = client.db()
//                 return cb()
//             })
//             .catch((err) => cb(err))
//     },
//     getDb: () => dbCollection
// }