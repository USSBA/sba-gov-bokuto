const cookieParser 		= require('cookie-parser')
const { EXTERNAL_SESSION_SECRET } = process.env;

module.exports = {
    requireAuth(req, res, next) {
        console.log(req.headers.cookie)
        console.log(req.headers.cookie.eSessionCookie)
        console.log(req.headers.cookie.eSessionCookiePlain)
        console.log('Cookies: ', req.cookies)
        console.log('Signed Cookies: ', cookieParser.signedCookies(req.signedCookies, EXTERNAL_SESSION_SECRET))
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