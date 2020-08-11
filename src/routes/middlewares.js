module.exports = {
    requireAuth(req, res, next) {
        console.log(req)
        console.log(req.session)
        console.log(req.session.eSessionCookie)
        console.log(req.session.eSessionCookiePlain)
        if (!req.session.userId) {
            console.log("Session missing!")
            // return res.redirect('/signin')
        } else {
            console.log("Session found!")
            // res.locals.user = req.session.userId;
        }

        next()
    }
}