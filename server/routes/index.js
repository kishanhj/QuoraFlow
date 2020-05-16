const questiontroutes = require("./question")
const commentsRouter = require("./comments")
const tagsroutes = require("./tags")
const searchRoutes = require("./search");
const userRoutes = require("./users")
// const admin = require('firebase-admin')


const constructorMethod = app => {
    // app.use("/questions", checkAuth)
    app.use("/questions", questiontroutes);
    app.use("/questions", commentsRouter); // adds comments routes to question
    // app.use("/tags", checkAuth)
    app.use("/tags", tagsroutes);
    // app.use("/search", checkAuth)
    app.use("/search", searchRoutes);
    app.use("/users", userRoutes)
    app.use("*", (req, res) => {
        res.status(404).json({
            error: "Not Found"
        });
    })
}

// var serviceAccount = require("../quoraoverflow-firebase-adminsdk-98d62-e218222843.json");

// var defaultApp = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
// console.log(defaultApp.name);  // '[DEFAULT]'
// // app.use("/", checkAuth)  


// function checkAuth(req, res, next) {
//     if (req.headers.authtoken) {
//         admin.auth().verifyIdToken(req.headers.authtoken)
//             .then(() => {
//                 next()
//             }).catch(() => {
//                 res.status(403).json({ Error: "Unauthorized Route" })
//             });
//     } else {
//         res.status(403).json({ Error: "Unauthorized Route" })
//     }
// }

module.exports = constructorMethod;
