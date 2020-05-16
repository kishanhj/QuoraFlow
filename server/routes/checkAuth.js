const admin = require("firebase-admin")



var serviceAccount = require("../quoraoverflow-firebase-adminsdk-98d62-e218222843.json");

var defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
console.log(defaultApp.name);  // '[DEFAULT]'
// app.use("/", checkAuth)  


function checkAuth(req, res, next) {
    if (req.headers.authtoken) {
        admin.auth().verifyIdToken(req.headers.authtoken)
            .then((t) => {
                console.log("usrOBJ:", t)
                req.locals = { email: t.email }
                next()
            }).catch(() => {
                res.status(403).json({ Error: "Unauthorized Route" })
            });
    } else {
        res.status(403).json({ Error: "Unauthorized Route", path: req.path })
    }
}
module.exports = {checkAuth}