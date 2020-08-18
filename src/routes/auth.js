const axios = require('axios')
const express = require('express')
const jwt = require('jsonwebtoken');
const usersRepo = require('../repositories/users')
const { HttpResponse } = require('aws-sdk')

const { CONNECT_BASE_URL, CONNECT_CLIENT_ID, CONNECT_CLIENT_SECRET, CONNECT_ENCRYPTION_KEY, BOKUTO_BASE_URL } = process.env;

const router = express.Router()

router.get("/signup", function(req, res) {
	res.render("signup", { userid: req.session.userId, errormessage: "" })
})

router.post('/signup', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;

	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) {
		return res.render('signup', { errormessage: "Email in use" })
	}

	if (password !== passwordConfirmation) {
		return res.render('signup', { errormessage: "Passwords must match" })
	}

	// Create a user in our user repo to represent this person
	const user = await usersRepo.create({ email, password, office
	 });

	// Store the id and office of that user inside the users cookie
	req.session.userId = user.id;
	req.session.userOffice = user.office;

	console.log("New user registered")
	res.render('index');
});
  
router.get('/signout', (req, res) => {
	req.session = null;

	console.log("User logged out")
	res.render('signin');
});

router.get('/login', (req, res) => {
	console.log(req)
	res.redirect(`https://${CONNECT_BASE_URL}/JWT/JWTLoginService?JWTClientId=${CONNECT_CLIENT_ID}&JWTRedirectUrl=https://${BOKUTO_BASE_URL}/authenticated`)
})

router.get('/authenticated', (req, res) => {
	axios({
		method: 'post',
		url: `https://${CONNECT_BASE_URL}/JwtToken`,
		headers: {
			'Content-Type': 'application/json'
		},
		data: {
			'client_id': CONNECT_CLIENT_ID,
			'client_secret': CONNECT_CLIENT_SECRET,
			'code': req.query.code
		}
	}).then((response) => {
		const jwtToken = response.data.Token
		console.log(jwtToken)
		axios({
			method: 'post',
			url: `https://${CONNECT_BASE_URL}/JwtToken/ValidateToken`,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${jwtToken}`
			},
			data: {
				'client_id': CONNECT_CLIENT_ID,
			}
		}).then((validatedResponse) => {
			const jwtValid = validatedResponse.data.Result
			if (jwtValid) {
				let options = {
					algorithms: 'HS256'
					// expiresIn: '1d',
					// issuer: `https://${CONNECT_BASE_URL}`
				}

				// This works
				try {
					let decodedData = jwt.decode(jwtToken)
					console.log(decodedData)
				}
				catch (err) {
					console.error(err)
				}

				// This does not work
				try {
					let decodedData = jwt.verify(jwtToken, CONNECT_ENCRYPTION_KEY, options)
					console.log(decodedData)
				}
				catch (err) {
					console.error(err)
				}
				
				// Save token here
			} else {
				console.log("The JWT is not valid!")
			}
			console.log(jwtValid)
			res.send("Authenticated with token: " + jwtToken + " with validation state of: " + jwtValid)
		}, (error) => {
			console.log(error)
		})
	}, (error) => {
		console.log(error)
	})
})

router.get('/signin', (req, res) => {
	res.render('signin', { errormessage: "" })
});
  
router.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	const user = await usersRepo.getOneBy({ email });

	if (!user) {
		return res.render('signin', { errormessage: "Email not found" })
	}

	if (user.password !== password) {
		return res.render('signin', { errormessage: "Invalid password" })
	}

	// Store the id and office of that user inside the users cookie
	req.session.userId = user.id;
	req.session.userOffice = user.office;

	res.render('index');
});

function streamToString (stream) {
	const chunks = []
	return new Promise((resolve, reject) => {
	  stream.on('data', chunk => chunks.push(chunk))
	  stream.on('error', reject)
	  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
	})
  }

module.exports = router;