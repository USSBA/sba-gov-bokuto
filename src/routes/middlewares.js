module.exports = {
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin')
        } else {
            console.log("Session found!")
            res.locals.user = req.session.userId;
        }

        next()
    }
}