const express = require('express')
const usersRepo = require('../../repositories/users')

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

	// Store the id of that user inside the users cookie
	req.session.userId = user.id;

	console.log("New user registered")
	res.redirect('/');
});
  
router.get('/signout', (req, res) => {
	req.session = null;

	console.log("User logged out")
	res.redirect('/');
});
  
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

	req.session.userId = user.id;

	res.render('/');
});

module.exports = router;