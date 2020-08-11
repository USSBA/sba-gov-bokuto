const cookieParser 		= require('cookie-parser')
const { EXTERNAL_SESSION_SECRET } = process.env;

module.exports = {
    requireAuth(req, res, next) {
        // console.log(req.headers.cookie)
        // console.log(req.headers.cookie.eSessionCookie)
        // console.log(req.headers.cookie.eSessionCookiePlain)
        // console.log('Cookies: ', req.cookies)
<<<<<<< HEAD
        // console.log('Signed Cookises: ', cookieParser.signedCookies(req.cookies['eSessionCookie'], EXTERNAL_SESSION_SECRET))
=======
        // console.log('Signed Cookies: ', cookieParser.signedCookies(req.cookies['eSessionCookie'], EXTERNAL_SESSION_SECRET))
>>>>>>> f8bdb5905a8c512646e8382b9d1826243df8d4d3
        // console.log()
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